import { Injectable } from '@angular/core';
import { Evento } from '@app/evento/evento';
import { Storage } from "@app/core/storage/storage";
import { Pergunta } from '@app/pergunta/pergunta';
import { QuestionarioDaEntrevista } from '@app/questionario/questionario';

@Injectable()
export class EventoStorage {

  constructor(private _store: Storage) {
  }

  obter() : Evento | null {
    return this._store.eventoOffline;
  }

  habilitar(questionarios: QuestionarioDaEntrevista[], evento: Evento) {
    this._store.questionarios = questionarios;
    this._store.eventoOffline = evento;
  }

  obterQuestionarios() : QuestionarioDaEntrevista[] {
    const evento = this._store.eventoOffline;
    if (!evento || !evento.id) {
      return [];
    }

    return this._store.questionarios;
  }
}