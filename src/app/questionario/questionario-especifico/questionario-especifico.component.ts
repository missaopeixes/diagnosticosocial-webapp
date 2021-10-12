import { Component, OnInit, EventEmitter } from '@angular/core';
import { Listagem } from '@app/shared/listagem';
import { Pergunta, TipoResposta } from '@app/pergunta/pergunta';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { Questionario, IQuestionario } from '@app/questionario/questionario';
import { finalize, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import { AnimationHelper } from '@app/shared/helpers/animation-helper';
import * as _ from 'lodash';
import { ModalService } from '@app/shared/modal/modal.service';
import { PerguntaEspecificaHelper } from '@app/pergunta/pergunta-especifica/pergunta-especifica.helper';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

const ID_TABLE = '#ds-questionario-perguntas-table';
const ID_MODAL_PERGUNTA = '#ds-questionario-pergunta-especifica-modal';

@Component({
  selector: 'app-questionario-especifico',
  templateUrl: './questionario-especifico.component.html',
  styleUrls: ['./questionario-especifico.component.scss']
})
export class QuestionarioEspecificoComponent implements OnInit {

  public questionario: Questionario;
  public perguntas: Listagem<Pergunta>;
  public carregando: boolean;
  public salvando: boolean;
  public pesquisando: boolean;
  public erroPerguntas: boolean;
  public form: FormGroup;
  public test: string;
  public perguntaSelecionada: Pergunta;

  constructor(
    private _questionarioService: QuestionarioService,
    private _pesquisaService: PerguntaService,
    private _toastrService: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _perguntaEspecificaHelper: PerguntaEspecificaHelper,
    private _router: Router,
    private _authentication: AuthenticationService,
    private _formBuilder: FormBuilder) {
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      nome: ['', Validators.required],
      pergunta: ['']
    });
  }

  ngOnInit() {
    this.questionario = new Questionario();

    this._initForm();
    this._activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'] ? parseInt(params['id']) : undefined;
      if (id) {
        this.obterQuestionario(id);
      }
    });
  }

  obterQuestionario(id: number) {
    this.carregando = true;
    this._questionarioService.obterEspecifico(id)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((obj: IQuestionario) => {
      this.questionario = new Questionario(obj);
      this.form.controls['nome'].setValue(obj.nome);
    },({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionário.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  salvar() {
    if (this.questionario.id) {
      this.atualizar();
    }
    else {
      this.criar();
    }
  }

  criar() {
    if (!this.form.valid) {
      return;
    }
    this.questionario.nome = this.form.value.nome;
    this.salvando = true;
    this._questionarioService.criar(this.questionario)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe(() => {
      this._toastrService.success('Questionário salvo com sucesso.');
      this._router.navigate(['/questionarios/']);
    }, ({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao salvar questionário.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  atualizar() {
    if (!this.form.valid) {
      return;
    }
    this.questionario.nome = this.form.value.nome;
    this.salvando = true;
    this._questionarioService.atualizar(this.questionario.id, this.questionario)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe(() => {
      this._toastrService.success('Questionário atualizado com sucesso.');
      this._router.navigate(['/questionarios/']);
    }, ({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao salvar questionário.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  public typeaheadPerguntas = {
    search: (text$: Observable<string>) => {
      return text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => {
          if (term.length < 1) return [];

          this.pesquisando = true;
          return this._pesquisaService.pesquisar(term).pipe(finalize(() => this.pesquisando = false));
        })
      );
    },
    formatter: (p: Pergunta) => p.descricao
  };

  incluirPergunta(pergunta: Pergunta) {
    if (!!_.find(this.questionario.perguntas, {id: pergunta.id})) {
      return this._toastrService.warning('Esta pergunta já pertence ao questionário.', 'Ops!');
    }

    this.questionario.perguntas.push(pergunta);
    AnimationHelper.table.splashNew(ID_TABLE, true);
    setTimeout(() => {
      this.form.controls['pergunta'].reset();
    });
  }

  removerPergunta(pergunta: Pergunta) {
    if (!!this.questionario.id) {
      this.salvando = true;
      this._questionarioService.desvincularPergunta(this.questionario.id, pergunta.id)
      .pipe(finalize(() =>
        this.salvando = false
      ))
      .subscribe((resultado: any) => {
        if (resultado === true) {
          _.remove(this.questionario.perguntas, {id: pergunta.id});
        }
      }, ({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao remover a pergunta.'
        this._toastrService.error(msg, 'Ops!');
      });
    }else{
      _.remove(this.questionario.perguntas, {id: pergunta.id});
    }
  }

  moverPergunta(pergunta: Pergunta, up: boolean) {
    const index = _.indexOf(this.questionario.perguntas, pergunta);
    const length = this.questionario.perguntas.length;
    _.remove(this.questionario.perguntas, pergunta);
    if (up) {
      this.questionario.perguntas.splice(index === 0 ? 0 : index-1, 0, pergunta);
    }
    else {
      this.questionario.perguntas.splice(index === length ? length : index+1, 0, pergunta);
    }
  }

  viausalizarPergunta(pergunta: Pergunta) {
    if (!pergunta.id) {
      return;
    }

    this._perguntaEspecificaHelper.abrir({
      pergunta: pergunta,
      completeFn: (obj: Pergunta) => {
        pergunta = obj;
      }
    });
  }

  novaPergunta() {
    this._perguntaEspecificaHelper.abrir({
      pergunta: new Pergunta({
        descricao: this.form.value.pergunta,
        tipoResposta: TipoResposta.MultiplaEscolha,
        opcoesResposta: [],
        idOrganizacao: this._authentication.getIdOrganizacao()
      }),
      completeFn: (obj: Pergunta) => this.incluirPergunta(obj)
    });
  }

  perguntaConcluida(pergunta: Pergunta) {
    let perguntaListagem = this.questionario.perguntas.find((p) => p.id === pergunta.id);

    if (!!perguntaListagem) {
      perguntaListagem.descricao = pergunta.descricao;
    }
    else {
      this.incluirPergunta(pergunta);
    }
  }
}
