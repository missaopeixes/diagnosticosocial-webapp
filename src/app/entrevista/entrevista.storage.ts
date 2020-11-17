import { Injectable } from '@angular/core';
import { AuthenticationService, Credentials } from '@app/core/authentication/authentication.service';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';

const STORAGE_ENTREVISTAS = 'webapp-storage-entrevistas';

@Injectable()
export class EntrevistaStorage {

  constructor(private authenticationService: AuthenticationService) {}

  private _get() : IEntrevista[] {
    let store:any = JSON.parse(localStorage.getItem(STORAGE_ENTREVISTAS));

    if (!store || !Array.isArray(store)) {
      localStorage.setItem(STORAGE_ENTREVISTAS, '[]');
      return [];
    }

    return store.map((e) => new Entrevista(e));
  }

  private _set(store: IEntrevista[]) : void {
    localStorage.setItem(STORAGE_ENTREVISTAS, JSON.stringify(store));
  }

  get credenciais(): Credentials | null {
    return this.authenticationService.credentials;
  }

  private _checkCredentials(): boolean {
    if (this.credenciais) {
      throw new Error('Credenciais inválidas');
    }
    return true;
  }

  obter(id: number) : IEntrevista | undefined {
    return this._get().find((e) => e.id === id);
  }

  criar(obj: Entrevista) : Entrevista {
    if (!this._checkCredentials()) return;

    let entrevistas = this._get();

    obj.offline = true;
    obj.idUsuario = this.credenciais.id;
    obj.id = (entrevistas.length + 1) * -1;

    entrevistas.push(obj);
    this._set(entrevistas);

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
