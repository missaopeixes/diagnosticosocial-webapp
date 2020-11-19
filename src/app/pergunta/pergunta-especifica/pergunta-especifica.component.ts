import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PerguntaEspecificaHelper } from '@app/pergunta/pergunta-especifica/pergunta-especifica.helper';
import { Pergunta, IPergunta, TipoResposta } from '@app/pergunta/pergunta';
import { ModalService } from '@app/shared/modal/modal.service';
import { debounceTime, distinctUntilChanged, switchMap, finalize, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpcaoResposta } from '@app/opcaoResposta/opcaoResposta';
import { RespostaService } from '@app/opcaoResposta/opcaoResposta.service';
import { AnimationHelper } from '@app/shared/helpers/animation-helper';
import { ToastrService } from 'ngx-toastr';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import * as _ from 'lodash';

const ID_MODAL = '#ds-pergunta-especifica-modal';
const ID_TABLE = '#ds-pergunta-opcoes-resposta-table';

@Component({
  selector: 'app-pergunta-especifica',
  templateUrl: './pergunta-especifica.component.html',
  styleUrls: ['./pergunta-especifica.component.scss']
})
export class PerguntaEspecificaComponent implements OnInit {

  public form: FormGroup;
  public salvando: boolean;
  public carregando: boolean;
  public pesquisando: boolean;
  public pergunta: Pergunta;
  public btnOkLabel: string;
  public exibeOpcoes: boolean;

  @Output() concluido = new EventEmitter<Pergunta>();

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _perguntaService: PerguntaService,
    private _opcaoRespostaService: RespostaService,
    private _toastrService: ToastrService,
    private _helper: PerguntaEspecificaHelper) {

    this._initForm();

    this._helper.observable().subscribe((opt) => {
      this.btnOkLabel = opt.completeLabel || 'Salvar';
      this._abrirModal(opt.pergunta);
    });
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      descricao: ['', Validators.required],
      tipoResposta: [1, Validators.required],
      opcaoResposta: ['']
    });
  }

  private _abrirModal(pergunta?: Pergunta) {
    this.pergunta = new Pergunta();
    this.form.reset();
    if (!!pergunta.id) {
      this.obterPergunta(pergunta.id);
    }
    else {
      this.form.controls['tipoResposta'].setValue(1);
      this.exibeOpcoes = true;
      if (pergunta.descricao) {
        this.form.controls['descricao'].setValue(pergunta.descricao);
      }
    }

    this._modalService.open(ID_MODAL);
  }

  obterPergunta(id: number) {
    this.carregando = true;
    this._perguntaService.obter(id)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((obj: IPergunta) => {
      this.pergunta = new Pergunta(obj);
      this.form.controls['descricao'].setValue(obj.descricao);
      this.form.controls['tipoResposta'].setValue(obj.tipoResposta);
      this.changeTipoResposta();
    },(error: any) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionário.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  private _atualizar() {
    return new Promise((res, rej) => {
      this.pergunta.descricao = this.form.value.descricao;
      this.pergunta.tipoResposta = this.form.value.tipoResposta;

      this.salvando = true;
      this._perguntaService.atualizar(this.pergunta)
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
      this.pergunta.descricao = this.form.value.descricao;
      this.pergunta.tipoResposta = this.form.value.tipoResposta;

      this.salvando = true;
      this._perguntaService.criar(this.pergunta)
      .pipe(finalize(() =>
        this.salvando = false
      ))
      .subscribe((obj: IPergunta) => {
        this.pergunta = new Pergunta(obj);
        res();
      }, ({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao sincronizar pergunta.'
        this._toastrService.error(msg, 'Ops!');
        rej();
      });
    });
  }

  ngOnInit() {
    this.pergunta = new Pergunta();
  }

  salvar(){
    if (!this.form.valid) {
      return new Promise((res, rej) => rej());
    }

    return this.pergunta.id ? this._atualizar() : this._criar();
  }

  typeaheadOpcoesResposta = {
    search: (text$: Observable<string>) => {
      return text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => {
          if (term.length < 1) return [];

          this.pesquisando = true;
          return this._opcaoRespostaService.pesquisar(term).pipe(finalize(() => this.pesquisando = false));
        })
      );
    },
    formatter: (r: OpcaoResposta) => r.descricao
  };

  incluirResposta(opcaoResposta: OpcaoResposta) {
    if (!!_.find(this.pergunta.opcoesResposta, {id: opcaoResposta.id})) {
      return this._toastrService.warning('Esta opção já pertence à pergunta.', 'Ops!');
    }

    this.pergunta.opcoesResposta.push(opcaoResposta);
    AnimationHelper.table.splashNew(ID_TABLE, true);
    setTimeout(() => {
      this.form.controls['opcaoResposta'].reset();
    });
  }

  criarResposta() {
    if (this.form.value.opcaoResposta.length === 0) return;

    this.salvando = true;
    this._opcaoRespostaService.criar(this.form.value.opcaoResposta)
    .pipe(finalize(() => this.salvando = false))
    .subscribe((opcaoResposta: OpcaoResposta) => {
      this.form.controls['opcaoResposta'].reset();
      this.pergunta.opcoesResposta.push(opcaoResposta);
      AnimationHelper.table.splashNew(ID_TABLE, true);
    }, () => {
      this._toastrService.error('Ocorreu um erro ao tentar incluir opcaoResposta na pergunta.', 'Ops');
    });
  }

  removerResposta(opcaoResposta: OpcaoResposta) {
    if (!!this.pergunta.id) {
      this.salvando = true;
      this._perguntaService.desvincularResposta(this.pergunta.id, opcaoResposta.id)
      .pipe(finalize(() =>
      this.salvando = false
      ))
      .subscribe((resultado: any) => {
        if (resultado === true) {
          _.remove(this.pergunta.opcoesResposta, {id: opcaoResposta.id});
        }
      }, ({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao remover a opção de resposta.'
        this._toastrService.error(msg, 'Ops!');
      });
    }else{
      _.remove(this.pergunta.opcoesResposta, {id: opcaoResposta.id});
    }
  }

  moverResposta(opcao: OpcaoResposta, up: boolean) {
    const index = _.indexOf(this.pergunta.opcoesResposta, opcao);
    const length = this.pergunta.opcoesResposta.length;
    _.remove(this.pergunta.opcoesResposta, opcao);
    if (up) {
      this.pergunta.opcoesResposta.splice(index === 0 ? 0 : index-1, 0, opcao);
    }
    else {
      this.pergunta.opcoesResposta.splice(index === length ? length : index+1, 0, opcao);
    }
  }

  changeTipoResposta() {
    switch (parseInt(this.form.value.tipoResposta)) {

      case TipoResposta.MultiplaEscolha:
      case TipoResposta.MultiplaSelecao:
        this.exibeOpcoes = true;
        break;

      default:
        this.exibeOpcoes = false;
        this.pergunta.opcoesResposta = [];
        break;
    }
  }

  concluir() {
    this.salvar().then(() => {
      this._modalService.close(ID_MODAL).then(() => {
        this.concluido.emit(this.pergunta);
      });
    })
  }
}
