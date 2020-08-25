import { Component, OnInit } from '@angular/core';
import { Evento } from '@app/evento/evento';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@app/shared/modal/modal.service';
import { EventoService } from '@app/evento/evento.service';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ActivatedRoute, Params } from '@angular/router';
import { QuestionarioDaEntrevista } from '@app/questionario/questionario';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { Pergunta } from '@app/pergunta/pergunta';
import { EventoRespostasHelperOptions, EventoRespostasHelper } from '../evento-respostas/evento-respostas.helper';

@Component({
  selector: 'app-evento-diagnostico',
  templateUrl: './evento-diagnostico.component.html',
  styleUrls: ['./evento-diagnostico.component.scss']
})
export class EventoDiagnosticoComponent implements OnInit {

  public carregando: boolean;
  public carregandoEvento: boolean;
  public salvando: boolean;
  public evento: Evento;
  public qtdEntrevistas: number;
  public qtdEntrevistasInt: number;
  public questionarios: QuestionarioDaEntrevista[];
  public questionario: QuestionarioDaEntrevista;

  public graphOptions = {
    view: [500, 220],
    legendTitle: 'Legenda',
    legendPosition: 'right',
    gradient: false,
    labels: true,
    maxLabelLength: 20,
    showLegend: false,
    explodeSlices: false,
    scheme: {
      // domain: ['#6DA7B5', '#827556', '#E8D93D', '#B5AE66', '#3B688F']
      domain: ['#228C7F', '#35D9C4', '#569F96', '#165951', '#76D9CC']
    }
  };

  constructor(
    private _eventoService: EventoService,
    private _toastrService: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private _questionarioService: QuestionarioService,
    private _eventoRespostasHelper: EventoRespostasHelper,
    private _modalService: ModalService) {
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'] ? parseInt(params['id']) : undefined;

      if (id) {
        this.obterDadosEvento(id);
      }
    });
  }

  public obterDadosEvento(idEvento: number) {

    this.carregandoEvento = true;
    this._eventoService.obter(idEvento)
    .pipe(finalize(() => this.carregandoEvento = false))
    .subscribe((resp: Evento) => this.evento = resp, (err) => {
      this._toastrService.error('Ocorreu um erro ao obter dados do evento.');
    });

    this.carregando = true;
    this._eventoService.relatorio(idEvento)
    .pipe(finalize(() => this.carregando = false))
    .subscribe((relatorio: Object[]) => this._montarRelatorio(relatorio))
  }

  private _montarRelatorio(relatorio: any[]){

    this.questionarios = [];

    let grupoQuestionarios = _.groupBy(relatorio, 'idQuestionario');
    let questionarios = _.orderBy(grupoQuestionarios, (g) => {return g[0]['ordemQuestionario']});

    questionarios.forEach(opcoesQ => {
      let qZero = opcoesQ[0];
      if (!qZero) {
        return;
      }

      let qObj = new QuestionarioDaEntrevista({
        id: qZero.idQuestionario,
        nome: qZero.questionario,
        ordem: qZero.ordemQuestionario,
        quantidadePorEnquete: qZero.qtdQuestPorEntrevista,
        perguntas: []
      });
      this.qtdEntrevistas = qZero.qtdEntrevistas;
      qObj.qtdRespondidos = qZero.qtdQuestRespondidos;

      let grupoPerguntas = _.groupBy(opcoesQ, 'idPergunta');
      let perguntas = _.orderBy(grupoPerguntas, (g) => {return g[0]['ordemPergunta']});

      qObj.perguntas = perguntas.map(opcoesP => {
        let pZero = opcoesP[0];
        if (!pZero) {
          return;
        }

        let dados = opcoesP.map(op => {
          op.name = !!op.opcaoResposta ? op.opcaoResposta : '-';
          op.value = op.qtdQuestRespondidos === 0 ? 0 : op.qtdEscolhas / op.qtdQuestRespondidos;
          op.count = op.qtdEscolhas;

          return op;
        });

        let greatest = 0;
        dados.forEach(op => {
          if (op.qtdEscolhas > greatest) {
            greatest = op.qtdEscolhas;
            dados.forEach(d => d.greatest = false);
            op.greatest = true;
          }
        });

        return new Pergunta({
          id: pZero.idPergunta,
          descricao: pZero.pergunta,
          tipoResposta: pZero.tipoResposta,
          opcoesResposta: dados
        });
      });

      this.questionarios.push(qObj);
    });

    this.questionario = this.questionarios[0];
  }

  tooltipOpcao(opcao: any){
    return `${opcao.data.name} <br> <b>${(opcao.data.value*100).toFixed(0)}%</b>`;
  }

  selecionarQuestionario(id: number) {
    this.questionario = _.find(this.questionarios, {id: id});
  }

  visualizarRespostas(pergunta: Pergunta) {
    this._eventoRespostasHelper.abrir({
      evento: this.evento,
      pergunta: pergunta
    });
  }
}
