import { Component, OnInit } from '@angular/core';
import { Listagem } from '@app/shared/listagem';
import { Pergunta, TipoResposta } from '@app/pergunta/pergunta';
import { EntrevistaService } from '@app/entrevista/entrevista.service';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';
import { finalize } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AnimationHelper } from '@app/shared/helpers/animation-helper';
import * as _ from 'lodash';
import { Resposta } from '@app/resposta/resposta';
import { EventoService } from '@app/evento/evento.service';
import { IEvento, Evento, QtdQuestionarioPorEnquete, QtdQuestionarioPorEnqueteUtils } from '@app/evento/evento';
import { QuestionarioDaEntrevista } from '@app/questionario/questionario';
import { ModalService } from '@app/shared/modal/modal.service';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { AuthenticationService } from '@app/core';

declare var $: any;

const ID_TABLE = '#ds-questionarios-respondidos-table';
const ID_LIST = '#ds-questionario-respondido-list';
const ID_MODAL_RESPOSTAS = '#ds-entrevista-especifica-respostas-modal';
const ID_MODAL_EXCLUSAO = '#ds-entrevista-modal-exclusao-questionario-respondido';
const ID_MODAL_CONFIRM_CANCELAMENTO_QUEST = '#ds-entrevista-modal-cancelamento-questionario-respondido';
const ID_MODAL_CONCLUSAO = '#ds-entrevista-modal-conclusao-entrevista';

@Component({
  selector: 'app-entrevista-especifica',
  templateUrl: './entrevista-especifica.component.html',
  styleUrls: ['./entrevista-especifica.component.scss']
})
export class EntrevistaEspecificaComponent implements OnInit {

  public entrevista: Entrevista;
  public respostas: Listagem<Resposta>;
  public carregando: boolean;
  public carregandoPerguntas: boolean;
  public carregandoQuestionarios: boolean;
  public salvando: boolean;
  public pesquisando: boolean;
  public erroRespostas: boolean;
  public form: FormGroup;
  public formQuestionario: FormGroup;
  public perguntaSelecionada: Pergunta;
  public eventos: Evento[];
  public questionarios: QuestionarioDaEntrevista[];
  public erroQuestionarios: string;
  public questionarioEmEdicao: number;
  public salvandoQuestionario: boolean;
  public excluindoQRespondido: boolean;
  public nomeUsuario: string;
  public offline: boolean;

  public questionarioSelecionado: QuestionarioDaEntrevista;
  public questionariosRespondidos: QuestionarioRespondido[];

  constructor(
    private _entrevistaService: EntrevistaService,
    private _eventoService: EventoService,
    private _toastrService: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _modalService: ModalService,
    private _questionarioService: QuestionarioService,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute) {
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      evento: ['', Validators.required],
      nome: ['', Validators.required],
      questionario: ['']
    });
    this.formQuestionario = this._formBuilder.group({
      observacoes: ['']
    });
    this.questionariosRespondidos = [];
  }

  private _offlineHabilitado() {
    return !!this._eventoService.obterHabilitadoOffline();
  }

  private _configuraOffline(offline: boolean) {
    this.offline = offline;
    if (offline && !this._offlineHabilitado()) {
      this._router.navigate(['/entrevistas/nova'], {
        queryParams: {
          offline: undefined
        }
      });
    }

    this._eventoService.offline = offline;
    this._questionarioService.offline = offline;
    this._entrevistaService.offline = offline;
  }

  ngOnInit() {
    this.entrevista = new Entrevista();
    this.questionariosRespondidos = [];

    this._initForm();
    this._route.queryParamMap.subscribe(queryParams => {
      this._configuraOffline(queryParams.get('offline') === 'true');

      this._activatedRoute.params.subscribe((params: Params) => {

        this.obterEventos(() => {
          const id = params['id'] ? parseInt(params['id']) : undefined;
          if (id) {
            this.obterEntrevista(id);
          }
          else if (this.eventos.length === 1) {
            this.form.controls['evento'].setValue(this.eventos[0]);
            this.eventoChanged();
          }
        });
      });
      this.nomeUsuario = this._authenticationService.credentials.nome.split(' ')[0];
    });
  }

  obterEntrevista(id: number) {
    this.carregando = true;
    this._entrevistaService.obterEspecifica(id)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((resp: IEntrevista) => {
      this.entrevista = new Entrevista(resp);
      this.questionariosRespondidos = resp['questionariosRespondidos'];

      let evento = _.find(this.eventos, {id: this.entrevista.idEvento});
      this.form.controls['nome'].setValue(this.entrevista.nome);
      this.form.controls['evento'].setValue(evento);

      this.carregandoQuestionarios = true;
      this._eventoService.obterQuestionarios(this.form.value.evento.id)
      .pipe(finalize(() =>
        this.carregandoQuestionarios = false
      ))
      .subscribe((respQ: QuestionarioDaEntrevista[]) => {
        this.questionarios = respQ;
        this.form.controls['questionario'].setValue(respQ[0]);

      },({error}) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionários.'
        this._toastrService.error(msg, 'Ops!');
      });

    },({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter eventos.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  obterEventos(done?: Function) {
    this.carregando = true;
    this._eventoService.obterTodos()
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((resp: IEvento[]) => {
      this.eventos = resp;
      if (done) {
        done();
      }
    },({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter eventos.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  eventoChanged() {

    this.carregandoQuestionarios = true;
    this._eventoService.obterQuestionarios(this.form.value.evento.id)
    .pipe(finalize(() =>
      this.carregandoQuestionarios = false
    ))
    .subscribe((resp: QuestionarioDaEntrevista[]) => {
      this.questionarios = resp;
      this.form.controls['questionario'].setValue(resp[0]);
    },({error}) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao obter questionários.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  private _aplicarRespostasFormulario(respostas: Resposta[], perguntas: Pergunta[]) {
    respostas.forEach(r => {
      if (!!r.idOpcaoEscolhida) {
        let pergunta = perguntas.find(p => p.id === r.idPergunta);

        if (pergunta.tipoResposta === TipoResposta.MultiplaEscolha) {
          this.formQuestionario.controls[`resposta-pergunta-${r.idPergunta}`].setValue(r.idOpcaoEscolhida.toString());
        }
        if (pergunta.tipoResposta === TipoResposta.MultiplaSelecao) {
          let groupMS: any = this.formQuestionario.controls[`resposta-pergunta-${r.idPergunta}`];
          groupMS.controls[`resposta-pergunta-${r.idPergunta}-selecao-${r.idOpcaoEscolhida}`].setValue(true);
        }
      }
      else if (!!r.respostaEmNumero) {
        this.formQuestionario.controls[`resposta-pergunta-${r.idPergunta}`].setValue(r.respostaEmNumero.toString());
      }
      else if (!!r.respostaEmTexto) {
        this.formQuestionario.controls[`resposta-pergunta-${r.idPergunta}`].setValue(r.respostaEmTexto);
      }

      if (!!r.observacoes) {
        this.formQuestionario.controls[`observacoes-pergunta-${r.idPergunta}`].setValue(r.observacoes);
      }
    });
  }
  
  private _montarFormulario(perguntas: Pergunta[], respostas?: Resposta[], observacoes?: string) {
    let group: any = {
      observacoes: new FormControl('')
    };
    let customValidators: ValidatorFn[] = [];

    perguntas.forEach((p) => {

      if (p.tipoResposta === TipoResposta.MultiplaSelecao) {
        let groupMS = {};
        p.opcoesResposta.forEach(op => groupMS[`resposta-pergunta-${p.id}-selecao-${op.id}`] = new FormControl(''));

        group[`resposta-pergunta-${p.id}`] = new FormGroup(groupMS);

        customValidators.push(this.validacaoMS(p));
      }
      else {
        group[`resposta-pergunta-${p.id}`] = new FormControl('', Validators.required);
      }

      group[`observacoes-pergunta-${p.id}`] = new FormControl('');
    });

    this.formQuestionario = new FormGroup(group);
    this.formQuestionario.setValidators(customValidators);
    this.questionarioSelecionado.perguntas = perguntas;

    if (!!respostas) {
      setTimeout(() => {
        this._aplicarRespostasFormulario(respostas, perguntas);
      }, 100);
    }

    if (!!observacoes) {
      this.formQuestionario.controls['observacoes'].setValue(observacoes);
    }
  }

  public validacaoMS(pergunta: Pergunta): ValidatorFn{
    return (group: FormGroup): ValidationErrors => {
      let g: any = group.controls[`resposta-pergunta-${pergunta.id}`];
      let perguntaMSValida = pergunta.opcoesResposta.filter(op => {
        let ctrl = g.controls[`resposta-pergunta-${pergunta.id}-selecao-${op.id}`];
        return ctrl ? ctrl.value == true : false;
      }).length > 0;

      if (!perguntaMSValida) {
        group.controls[`resposta-pergunta-${pergunta.id}`].setErrors({
          required: true
        });
      }
      return;
    };
  }

  private _selecionarQuestionarioNaoRespondido() {

    const proximoNaoRespondido = this.questionarios.find(q => {
      return !this.questionariosRespondidos.find(qr => qr.idQuestionario === q.id);
    });

    if (proximoNaoRespondido) {
      this.form.controls['questionario'].setValue(proximoNaoRespondido);
    }
  }

  responderQuestionario() {
    if (!!this.form.value.questionario && this.form.value.questionario.id) {

      if (
        this.form.value.questionario.quantidadePorEnquete === QtdQuestionarioPorEnquete.apenasUm &&
        _.find(this.questionariosRespondidos, {idQuestionario: this.form.value.questionario.id})) {
          return this._toastrService.warning('Deve ser respondido apenas uma vez por entrevista!', 'Questionário já respondido');
      }

      this.questionarioSelecionado = this.form.value.questionario;

      this.questionarioSelecionado.perguntas = [];
      this._modalService.open(ID_MODAL_RESPOSTAS);

      this.carregandoPerguntas = true;
      this._questionarioService.obterPerguntas(this.questionarioSelecionado.id)
      .pipe(finalize(() =>
        this.carregandoPerguntas = false
      ))
      .subscribe((perguntas: Pergunta[]) =>
        this._montarFormulario(perguntas)
      ,(error) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro inicializar entrevista.'
        this._toastrService.error(msg, 'Ops!');
      });
    }
  }

  editarQuestionario(respondido: QuestionarioRespondido) {
    this._modalService.open(ID_MODAL_RESPOSTAS);

    this.formQuestionario = new FormGroup({});
    this.carregandoPerguntas = true;
    this._questionarioService.obterPerguntas(respondido.idQuestionario)
    .subscribe((perguntas: Pergunta[]) => {

      this._entrevistaService.obterRespostas(this.entrevista.id, respondido.id)
      .pipe(finalize(() => this.carregandoPerguntas = false))
      .subscribe((respostas: Resposta[]) => {
        this.questionarioSelecionado = _.find(this.questionarios, {id: respondido.idQuestionario});
        this.questionarioEmEdicao = respondido.id;
        this._montarFormulario(perguntas, respostas, respondido.observacoes);
      },(error) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao carregar as respostas.'
        this._toastrService.error(msg, 'Ops!');
      });
    },(error) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao carregar perguntas.'
      this._toastrService.error(msg, 'Ops!');
      this._modalService.close(ID_MODAL_RESPOSTAS);
    });
  }

  concluirQuestionario() {
    if (!this.formQuestionario.valid) {
      return;
    }

    let questionarioRespondido = new QuestionarioRespondido({
      id: this.questionarioEmEdicao,
      idQuestionario: this.questionarioSelecionado.id,
      respostas: [],
      observacoes: this.formQuestionario.value['observacoes']
    });

    this.questionarioSelecionado.perguntas.forEach((pergunta) => {

      let respostaForm;
      let observcoesForm = this.formQuestionario.value[`observacoes-pergunta-${pergunta.id}`];
      let resposta = new Resposta({
        idQuestionario: questionarioRespondido.idQuestionario,
        idPergunta: pergunta.id,
        observacoes: observcoesForm
      });

      switch (pergunta.tipoResposta) {
        case TipoResposta.MultiplaEscolha:
          respostaForm = this.formQuestionario.value[`resposta-pergunta-${pergunta.id}`];
          resposta.idOpcaoEscolhida = respostaForm;
          questionarioRespondido.respostas.push(resposta);
          break;

        case TipoResposta.Texto:
          respostaForm = this.formQuestionario.value[`resposta-pergunta-${pergunta.id}`];
          resposta.respostaEmTexto = respostaForm;
          questionarioRespondido.respostas.push(resposta);
          break;

        case TipoResposta.Numero:
          respostaForm = this.formQuestionario.value[`resposta-pergunta-${pergunta.id}`];
          resposta.respostaEmNumero = parseFloat(respostaForm);
          questionarioRespondido.respostas.push(resposta);
          break;

        case TipoResposta.MultiplaSelecao:
          pergunta.opcoesResposta.forEach(op => {
            let msFormGroup: any = this.formQuestionario.controls[`resposta-pergunta-${pergunta.id}`];
            if (msFormGroup) {
              if (msFormGroup.value[`resposta-pergunta-${pergunta.id}-selecao-${op.id}`] == true) {
                let r = Object.assign({}, resposta);
                r.idOpcaoEscolhida = op.id;
                questionarioRespondido.respostas.push(r);
              }
            }
          });
          break;

        default:
          break;
      }
    });

    const salvarQuestionario = (qRespondido: QuestionarioRespondido) => {
      this.salvandoQuestionario = true;
      window.document.querySelectorAll('#form-entrevista')[0].scrollTo(0, 0);

      if (!!qRespondido.id) {
        this._entrevistaService.atualizarQuestionario(this.entrevista.id, qRespondido)
        .pipe(finalize(() => this.salvandoQuestionario = false))
        .subscribe(() => {
          this._toastrService.success('Respostas atualizadas.', 'OK!');
          this._modalService.close(ID_MODAL_RESPOSTAS).then(() => {
            var qLista = _.find(this.questionariosRespondidos, {id: qRespondido.id});
            Object.assign(qLista, qRespondido);
          });
        },(error) => {
          const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao atualizar respostas.';
          this._toastrService.error(msg, 'Ops!');
        });
      }
      else {
        this._entrevistaService.criarQuestionario(this.entrevista.id, qRespondido)
        .pipe(finalize(() => this.salvandoQuestionario = false))
        .subscribe((q: QuestionarioRespondido) => {
          // this._toastrService.success('Questionário respondido.', 'OK!');
          this._modalService.close(ID_MODAL_RESPOSTAS).then(() => {
            this.questionariosRespondidos.push(q);
            this._selecionarQuestionarioNaoRespondido();
            AnimationHelper.table.splashNew(ID_TABLE, true);
            //AnimationHelper.table.splashNew(ID_LIST, true); fazer animação splash para o card no mobile
          });
        },(error) => {
          const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao salvar questionário respondido.';
          this._toastrService.error(msg, 'Ops!');
        });
      }
    }

    if (!!this.entrevista.id) {
      salvarQuestionario(questionarioRespondido);
    }
    else {
      this.criarEntrevista().then(() => salvarQuestionario(questionarioRespondido));
    }
  }

  changeNomeEntrevistado() {
    if (!!this.entrevista.id) {
      this.salvando = true;
      let obj = new Entrevista(this.entrevista);
      obj.nome = this.form.value['nome'];
      this._entrevistaService.atualizar(this.entrevista.id, obj)
      .pipe(finalize(() =>
      this.salvando = false
      ))
      .subscribe((resp: Entrevista) => this.entrevista.nome = obj.nome,
        (error) => {
          const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao concluir entrevista.';
          this._toastrService.error(msg, 'Ops!');
        }
      );
    }
  }

  cancelarQuestionario() {
    if (this.formQuestionario.pristine) {
      this.fecharQuestionario();
    }
    else {
      this._modalService.close(ID_MODAL_RESPOSTAS).then(() => {
        this._modalService.open(ID_MODAL_CONFIRM_CANCELAMENTO_QUEST);
      });
    }
  }

  cancelarCancelamentoQuestionario() {
    this._modalService.close(ID_MODAL_CONFIRM_CANCELAMENTO_QUEST).then(() => {
      this._modalService.open(ID_MODAL_RESPOSTAS);
    });
  }

  confirmarCancelamentoQuestionario() {
    this.questionarioEmEdicao = undefined;
    this._modalService.close(ID_MODAL_CONFIRM_CANCELAMENTO_QUEST);
  }

  fecharQuestionario() {
    this.questionarioEmEdicao = undefined;
    this._modalService.close(ID_MODAL_RESPOSTAS);
  }

  cancelarQuestionarioExcluisao() {
    this.questionarioEmEdicao = undefined;
    this._modalService.close(ID_MODAL_EXCLUSAO);
  }

  nomeQuestionario(id: number) {
    let q = _.find(this.questionarios, {id: id});
    return !!q ? q.nome : '';
  }

  removerQuestionarioRespondido(id: number) {
    this.questionarioEmEdicao = id;
    this._modalService.open(ID_MODAL_EXCLUSAO);
  }

  confirmaExclusaoQuestionarioRespondido() {
    this.excluindoQRespondido = true;
    this._entrevistaService.excluirQuestionario(this.entrevista.id, this.questionarioEmEdicao)
    .pipe(finalize(() => this.excluindoQRespondido = false))
    .subscribe((q: QuestionarioRespondido) => {
      this._toastrService.success('Questionário excluido.', 'OK!');
      this._modalService.close(ID_MODAL_EXCLUSAO).then(() => {
        _.remove(this.questionariosRespondidos, {id: this.questionarioEmEdicao});
        this.questionarioEmEdicao = undefined;
      });
    },(error) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao excluir questionário respondido.';
      this._toastrService.error(msg, 'Ops!');
    });
  }

  qtdQuestionarioPorEnqueteStr(qtdPorEnquete: QtdQuestionarioPorEnquete) {
    return QtdQuestionarioPorEnqueteUtils.toString(qtdPorEnquete);
  }

  concluirEntrevista() {
    let possuiQuestionarioEmFalta = false;
    this.questionarios.forEach((q) => {
      if (q.quantidadePorEnquete === QtdQuestionarioPorEnquete.apenasUm || q.quantidadePorEnquete === QtdQuestionarioPorEnquete.peloMenosUm) {
        if (!_.find(this.questionariosRespondidos, {idQuestionario: q.id})) {
          possuiQuestionarioEmFalta = true;
          this._toastrService.warning(`O questionário "${q.nome}" deve ser respondido!`, 'Atenção')
        }
      }
    });
    if (possuiQuestionarioEmFalta || !this.entrevista.id) {
      return;
    }
    window.document.querySelectorAll('#form-entrevista')[0].scrollTo(0, 0);

    let obj = new Entrevista(this.entrevista);
    obj.concluida = true;
    this.salvando = true;
    this._entrevistaService.atualizar(this.entrevista.id, obj)
    .pipe(finalize(() =>
    this.salvando = false
    ))
    .subscribe(() => {
      this.entrevista.concluida = true;
      this._modalService.open(ID_MODAL_CONCLUSAO);
    },(error) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao concluir entrevista.';
      this._toastrService.error(msg, 'Ops!');
    });
  }

  criarEntrevista() {
    return new Promise((res, rej) => {
      this.entrevista = new Entrevista();
      this.entrevista.idEvento = this.form.value['evento'].id;
      this.entrevista.evento = this.form.value['evento'].nome;
      this.entrevista.nome = this.form.value['nome'];
  
      this.salvando = true;
      this._entrevistaService.criar(this.entrevista)
      .pipe(finalize(() =>
        this.salvando = false
      ))
      .subscribe((e: Entrevista) => {
        this.entrevista = e;
        res();
      },(error) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao salvar entrevista.';
        this._toastrService.error(msg, 'Ops!');
        rej();
      });
    });
  }

  novaEntrevista() {
    this._activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'] ? parseInt(params['id']) : undefined;
      if (!!id) {
        this._router.navigate(['/entrevistas/nova']);
      }
      else {
        this._modalService.close(ID_MODAL_CONCLUSAO).then(() => this.ngOnInit());
      }
    });
  }

  voltar() {
    this._modalService.close(ID_MODAL_CONCLUSAO).then(() => {
      this._router.navigate(['/entrevistas']);
    });
  }

  perguntaRespondida(id: number) {
    const pergunta = this.questionarioSelecionado.perguntas.find(p => p.id === id);
    if (!pergunta) {
      return false;
    }

    const ctrl = this.formQuestionario.controls[`resposta-pergunta-${pergunta.id}`];
    return ctrl ? ctrl.valid : false;
  }

  abrirOpcoes(id: number){
    const display = $('#questionario-respondido-mobile-opcoes-'+id).attr('style');
    if (display == null || display == '') {
      $('#questionario-respondido-mobile-opcoes-'+id).slideUp(100);
    }
    else{
      $('#questionario-respondido-mobile-opcoes-'+id).slideDown(100);
    }
  }
}
