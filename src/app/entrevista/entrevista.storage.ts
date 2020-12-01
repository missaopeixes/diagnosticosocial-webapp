import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Entrevista, IEntrevista } from '@app/entrevista/entrevista';
import { Storage } from "@app/core/storage/storage";

export class EntrevistaStorage {

  constructor(
    private _authService: AuthenticationService,
    private _store: Storage) {}

  obter(id: number) : IEntrevista | undefined {
    return this._store.entrevistas.find((e) => e.id === id);
  }

  criar(obj: Entrevista) : Entrevista {
    if (!this._authService.credentials) return;

    let entrevistas = this._store.entrevistas;

    obj.offline = true;
    obj.idUsuario = this._authService.credentials.id;
    obj.id = (entrevistas.length + 1) * -1;

    entrevistas.push(obj);
    this._store.entrevistas = entrevistas;

    return obj;
  }

  // atualizar(id: number, entrevista: Entrevista) : Observable<Entrevista> {
  //   return this._httpClient.put<Entrevista>(routes.especifica(id), entrevista);
  // }

  // excluir(id: number) : Promise<any> {
  //   return this._httpClient.delete(routes.especifica(id)).toPromise();
  // }

  // limpar() : Promise<any> {
  //   return this._httpClient.delete(routes.especifica(id)).toPromise();
  // }

  // obterRespostas(idEntrevista: number, idQuestionarioRespondido: number) : Observable<Resposta[]> {
  //   return this._httpClient.get<Resposta[]>(routes.respostas(idEntrevista, idQuestionarioRespondido))
  // }

  // criarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) {
  //   return this._httpClient.post(routes.questionario(idEntrevista), questionario);
  // }

  // atualizarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) {
  //   return this._httpClient.put(routes.questionarioEspecico(idEntrevista, questionario.id), questionario);
  // }

  // excluirQuestionario(idEntrevista: number, idQuestionarioRespondido: number) {
  //   return this._httpClient.delete(routes.questionarioEspecico(idEntrevista, idQuestionarioRespondido));
  // }
}
