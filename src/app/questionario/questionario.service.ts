import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Questionario, IQuestionario } from '@app/questionario/questionario';
import { Pergunta, IPergunta } from '@app/pergunta/pergunta';

const routes = {
  listar: (pagina: number, itensPorPagina?: number) => `/questionarios/?${ListagemHelper.paginacao.queryParams(pagina, itensPorPagina)}`,
  listarTodos: () => `/questionarios/todos`,
  escpecifico: (id: number) => `/questionarios/${id}`,
  criar: () => `/questionarios/`,
  perguntas: (id: number) => `/questionarios/${id}/perguntas`,
  pergunta: (id: number, idPergunta: number) => `/questionarios/${id}/perguntas/${idPergunta}`
};

@Injectable()
export class QuestionarioService {

  constructor(private _httpClient: HttpClient) { }

  obterPorPagina(pagina: number, itensPorPagina?: number) : Observable<Listagem<Questionario>> {
    return this._httpClient.get<Listagem<Questionario>>(routes.listar(pagina, itensPorPagina));
  }

  obterTodos() : Observable<IQuestionario[]> {
    return this._httpClient.get<IQuestionario[]>(routes.listarTodos());
  }

  obterEspecifico(id: number) : Observable<IQuestionario> {
    return this._httpClient.get<IQuestionario>(routes.escpecifico(id));
  }

  criar(questionario: Questionario) : Observable<IQuestionario> {
    return this._httpClient.post<IQuestionario>(routes.criar(), questionario);
  }

  atualizar(id: number, questionario: Questionario) : Observable<Questionario> {
    return this._httpClient.put<Questionario>(routes.escpecifico(id), questionario);
  }

  excluir(id: number) : Promise<any> {
    return this._httpClient.delete(routes.escpecifico(id)).toPromise();
  }

  obterPerguntas(id: number) : Observable<IPergunta[]> {
    return this._httpClient.get<IPergunta[]>(routes.perguntas(id))
  }

  vincularPergunta(id: number, idPergunta: number) {
    return this._httpClient.put(routes.pergunta(id, idPergunta), {});
  }

  desvincularPergunta(id: number, idPergunta: number) : Observable<any> {
    return this._httpClient.delete(routes.pergunta(id, idPergunta));
  }
}
