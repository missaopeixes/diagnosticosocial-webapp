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
import { EventoRespostasHelper } from './evento-respostas.helper';
import { Pergunta } from '@app/pergunta/pergunta';
import { Resposta } from '@app/resposta/resposta';
import * as moment from 'moment';

const ID_MODAL = '#ds-evento-respostas-modal';

@Component({
  selector: 'app-evento-respostas',
  templateUrl: './evento-respostas.component.html',
  styleUrls: ['./evento-respostas.component.scss']
})
export class EventoRespostasComponent implements OnInit {

  public carregando: boolean;
  public evento: Evento;
  public pergunta: Pergunta;
  public respostas: Resposta[];

  constructor(
    private _eventoService: EventoService,
    private _toastrService: ToastrService,
    private _modalService: ModalService,
    private _helper: EventoRespostasHelper) {

    this._helper.observable().subscribe((opt) => {
      this.evento = opt.evento;
      this.pergunta = opt.pergunta;
      this.respostas = [];

      this._modalService.open(ID_MODAL);
      this._carregarDados();
    });
  }

  private _carregarDados(){
    this.carregando = true;
    this._eventoService.respostas(this.evento.id, this.pergunta.id)
    .pipe(finalize(() => this.carregando = false))
    .subscribe((resp: Resposta[]) => this.respostas = resp, () => {
      this._toastrService.error('Ocorreu um erro ao obter as respostas da pergunta.');
    });
  }

  ngOnInit() {
  }

  formatDateTime(date: string) {
    return `${moment(date).format('DD/MM/YYYY')} às ${moment(date).format('HH:mm')}`;
  }
}
