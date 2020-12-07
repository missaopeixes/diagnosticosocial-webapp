import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';
import { Storage } from "@app/core/storage/storage";
import { Resposta } from '@app/resposta/resposta';

export class EntrevistaStorage {

  constructor(
    private _authService: AuthenticationService,
    private _store: Storage) {}

  private _autoDecrement(list: Entrevista[] | QuestionarioRespondido[]): number {
    const lastItem = list.slice(-1)[0];
    const id = lastItem.id - 1;
    return id;
  }

  obter(id: number) : IEntrevista | undefined {
    let entrevista = this._store.entrevistas.find((e) => e.id === id);

    if (!entrevista) {
      return;
    }

    entrevista.questionariosRespondidos = this._store.questionariosRespondidos.filter(qr => qr.idEntrevistaOffline === id);

    return entrevista;
  }

  listar() : Entrevista[] {
    return this._store.entrevistas;
  }

  criar(obj: Entrevista) : Entrevista {
    if (!this._authService.credentials) return;

    let entrevistas = this._store.entrevistas;

    obj.offline = true;
    obj.idUsuario = this._authService.credentials.id;
    obj.usuario = this._authService.credentials.nome;

    obj.id = entrevistas.length <= 0 ? -1 : this._autoDecrement(entrevistas);

    entrevistas.push(obj);
    this._store.entrevistas = entrevistas;

    return obj;
  }

  excluir(id: number) {
    let e = this.obter(id);
    e.questionariosRespondidos.forEach((qr) => {
      this.excluirQuestionarioRespondido(id, qr.id);
    });
    let lista = this._store.entrevistas;
    this._store.entrevistas = lista.filter(e => e.id !== id);
  }

  atualizar(id: number, obj: Entrevista) : Entrevista {
    let lista = this._store.entrevistas;

    let e = lista.find((e) => e.id === id);
    e.nome = obj.nome;
    e.concluida = obj.concluida;
    e.observacoes = obj.observacoes;

    this._store.entrevistas = lista;

    return obj;
  }

  salvarQuestionarioRespondido(obj: QuestionarioRespondido) : QuestionarioRespondido {
    let lista = this._store.questionariosRespondidos;

    obj.id = lista.length <= 0 ? -1 : this._autoDecrement(lista);

    lista.push(obj);
    this._store.questionariosRespondidos = lista;

    return obj;
  }

  atualizarQuestionarioRespondido(obj: QuestionarioRespondido) : QuestionarioRespondido {
    let lista = this._store.questionariosRespondidos;

    let qr = lista.find((e) => e.id === obj.id);
    qr.respostas = obj.respostas;
    qr.observacoes = obj.observacoes;

    this._store.questionariosRespondidos = lista;

    return obj;
  }

  obterRespostas(id: number, idQuestionarioRespondido: number) : Resposta[] {
    let qRespondido = this._store.questionariosRespondidos.find(qr => qr.idEntrevistaOffline === id && qr.id === idQuestionarioRespondido);
    return qRespondido ? qRespondido.respostas : [];
  }

  excluirQuestionarioRespondido(id: number, idQuestionarioRespondido: number) {
    let lista = this._store.questionariosRespondidos;
    this._store.questionariosRespondidos = lista.filter(qr => !(qr.idEntrevistaOffline === id && qr.id === idQuestionarioRespondido));
  }

  limparStorage() {
    this._store.limpar();
  }
}
