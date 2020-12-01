import { Injectable } from '@angular/core';
import { Storage } from "@app/core/storage/storage";
import { Pergunta } from '@app/pergunta/pergunta';

@Injectable()
export class QuestionarioStorage {

  constructor(private _store: Storage) {
  }

  obterPerguntas(id: number) : Pergunta[] {
    const evento = this._store.eventoOffline;
    if (!evento || !evento.id) {
      return [];
    }

    const questionario = this._store.questionarios.find(q => q.id === id);

    return questionario ? questionario.perguntas : [];
  }
}