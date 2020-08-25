import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EventoEspecificoHelper } from '@app/evento/evento-especifico/evento-especifico.helper';
import { Evento, IEvento, QuestionarioDoEvento, QtdQuestionarioPorEnquete, QtdQuestionarioPorEnqueteUtils, IQtdQuestionarioPorEnquete } from '@app/evento/evento';
import { ModalService } from '@app/shared/modal/modal.service';
import { finalize } from 'rxjs/operators';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { AnimationHelper } from '@app/shared/helpers/animation-helper';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from '@app/evento/evento.service';
import * as _ from 'lodash';
import { IQuestionario, Questionario } from '@app/questionario/questionario';

const ID_MODAL = '#ds-evento-especifico-modal';
const ID_TABLE = '#ds-evento-questionarios-table';
@Component({
  selector: 'app-evento-especifico',
  templateUrl: './evento-especifico.component.html',
  styleUrls: ['./evento-especifico.component.scss']
})
export class EventoEspecificoComponent implements OnInit {

  public form: FormGroup;
  public salvando: boolean;
  public carregando: boolean;
  public pesquisando: boolean;
  public evento: Evento;
  public questionarios: Questionario[];
  public btnOkLabel: string;
  public exibeOpcoes: boolean;
  public listaQtdPorEnquete: IQtdQuestionarioPorEnquete[];

  @Output() concluido = new EventEmitter<Evento>();

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _eventoService: EventoService,
    private _questionarioService: QuestionarioService,
    private _toastrService: ToastrService,
    private _helper: EventoEspecificoHelper) {

    this._initForm();

    this._helper.observable().subscribe((opt) => {
      this.btnOkLabel = opt.completeLabel || 'Salvar';
      this._abrirModal(opt.evento);
    });
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      nome: ['', Validators.required],
      questionario: [''],
      qtdPorEnquete: [''],
    });
    this.listaQtdPorEnquete = QtdQuestionarioPorEnqueteUtils.toList();
  }

  private _abrirModal(evento?: Evento) {
    this.evento = new Evento();
    this.form.reset();

    this.carregando = true;
    this._questionarioService.obterTodos()
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((questionarios: IQuestionario[]) => {
      this.questionarios = questionarios;

      if (!!evento.id) {
        this.obterEvento(evento.id);
      }
    },(error: any) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionários.'
      this._toastrService.error(msg, 'Ops!');
    });

    this._modalService.open(ID_MODAL);
  }

  obterEvento(id: number) {
    this.carregando = true;
    this._eventoService.obter(id)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((obj: IEvento) => {
      this.evento = new Evento(obj);
      this.form.controls['nome'].setValue(obj.nome);
    },(error: any) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionário.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  private _atualizar() {
    return new Promise((res, rej) => {
      this.evento.nome = this.form.value.nome;

      this.salvando = true;
      this._eventoService.atualizar(this.evento.id, this.evento)
      .pipe(finalize(() =>
        this.salvando = false
      ))
      .subscribe(() => {
        res();
      }, ({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao salvar questionário.'
        this._toastrService.error(msg, 'Ops!');
      });
    });
  }

  private _criar() {
    return new Promise((res, rej) => {
      this.evento.nome = this.form.value.nome;

      this.salvando = true;
      this._eventoService.criar(this.evento)
      .pipe(finalize(() =>
        this.salvando = false
      ))
      .subscribe((obj: IEvento) => {
        this.evento = new Evento(obj);
        res();
      }, ({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao sincronizar evento.'
        this._toastrService.error(msg, 'Ops!');
        rej();
      });
    });
  }

  ngOnInit() {
    this.evento = new Evento();
  }

  salvar(){
    if (!this.form.valid) {
      return new Promise((res, rej) => rej());
    }

    return this.evento.id ? this._atualizar() :this._criar();
  }

  incluirQuestionario() {
    if (!this.form.value.questionario || !this.form.value.qtdPorEnquete) {
      return;
    }

    if (!!_.find(this.evento.questionarios, {idQuestionario: this.form.value.questionario.id})) {
      return this._toastrService.warning('Este quationário já pertence ao evento.', 'Ops!');
    }

    let obj = new QuestionarioDoEvento();
    obj.idQuestionario = this.form.value.questionario.id;
    obj.quantidadePorEnquete = this.form.value.qtdPorEnquete;

    this.evento.questionarios.push(obj);
    AnimationHelper.table.splashNew(ID_TABLE, true);
    setTimeout(() => {
      this.form.controls['questionario'].reset();
      this.form.controls['qtdPorEnquete'].reset();
    });
  }

  removerQuestionario(questionario: QuestionarioDoEvento) {
    return _.remove(this.evento.questionarios, {idQuestionario: questionario.idQuestionario});
  }

  moverQuestionario(q: QuestionarioDoEvento, up: boolean) {
    const index = _.indexOf(this.evento.questionarios, q);
    const length = this.evento.questionarios.length;
    _.remove(this.evento.questionarios, q);
    if (up) {
      this.evento.questionarios.splice(index === 0 ? 0 : index-1, 0, q);
    }
    else {
      this.evento.questionarios.splice(index === length ? length : index+1, 0, q);
    }
  }

  descricaoQtdPorEnquete(qtd: string) {
    return QtdQuestionarioPorEnqueteUtils.toString(parseInt(qtd));
  }

  descricaoQuestionario(idQuestionario: string) {
    const obj = _.find(this.questionarios, {id: parseInt(idQuestionario)});
    return obj ? obj.nome : '';
  }

  concluir() {
    this.salvar().then(() => {
      this._modalService.close(ID_MODAL).then(() => {
        this.concluido.emit(this.evento);
      });
    })
  }
}
