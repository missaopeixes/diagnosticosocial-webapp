import { Injectable } from "@angular/core";
import { Entrevista, QuestionarioRespondido } from "@app/entrevista/entrevista";
import { Evento } from "@app/evento/evento";
import { QuestionarioDaEntrevista } from "@app/questionario/questionario";
import * as moment from 'moment';

const LOCAL = {
  eventos: 'webapp-storage-eventos',
  questionarios: 'webapp-storage-questionarios',
  questionariosRespondidos: 'webapp-storage-questionarios-respondidos',
  entrevistas: 'webapp-storage-entrevistas',
  eventoOffline: 'webapp-evento-offline',
  validadeEventoOffline: 'webapp-validade-evento-offline'
};

@Injectable()
export class Storage {

  constructor() {}

  private _getStorage(nome: string): any[] {
    let store:any[] = JSON.parse(localStorage.getItem(nome));

    if (!store || !Array.isArray(store)) {
      localStorage.setItem(nome, '[]');
      return [];
    }

    return store;
  }

  get eventos() : Evento[] {
    return this._getStorage(LOCAL.eventos).map(obj => new Evento(obj));
  }
  set eventos(store: Evento[]) {
    localStorage.setItem(LOCAL.eventos, JSON.stringify(store));
  }

  get questionarios() : QuestionarioDaEntrevista[] {
    return this._getStorage(LOCAL.questionarios).map(obj => new QuestionarioDaEntrevista(obj));
  }
  set questionarios(store: QuestionarioDaEntrevista[]) {
    localStorage.setItem(LOCAL.questionarios, JSON.stringify(store));
  }

  get entrevistas() : Entrevista[] {
    return this._getStorage(LOCAL.entrevistas).map(obj => new Entrevista(obj));
  }
  set entrevistas(store: Entrevista[]) {
    localStorage.setItem(LOCAL.entrevistas, JSON.stringify(store));
  }

  get questionariosRespondidos() : QuestionarioRespondido[] {
    return this._getStorage(LOCAL.questionariosRespondidos).map(obj => new QuestionarioRespondido(obj));
  }
  set questionariosRespondidos(store: QuestionarioRespondido[]) {
    localStorage.setItem(LOCAL.questionariosRespondidos, JSON.stringify(store));
  }

  get eventoOffline(): Evento | null {
    let evento = new Evento(JSON.parse(localStorage.getItem(LOCAL.eventoOffline)));
    let validade = moment(localStorage.getItem(LOCAL.validadeEventoOffline), 'DD/MM/YYYY');

    if (evento && evento.id && moment().diff(validade, 'days') > 0) {
      return null;
    }

    return evento;
  }
  set eventoOffline(evento: Evento) {
    if (evento.id) {
      localStorage.setItem(LOCAL.eventoOffline, JSON.stringify(evento));
      localStorage.setItem(LOCAL.validadeEventoOffline, JSON.stringify(moment().add(0, 'day').format('DD/MM/YYYY')));
    }
  }

  limpar(): void {
    localStorage.removeItem(LOCAL.entrevistas);
    localStorage.removeItem(LOCAL.eventoOffline);
    localStorage.removeItem(LOCAL.eventos);
    localStorage.removeItem(LOCAL.questionarios);
    localStorage.removeItem(LOCAL.questionariosRespondidos);
    localStorage.removeItem(LOCAL.validadeEventoOffline);
    return;
  }
}