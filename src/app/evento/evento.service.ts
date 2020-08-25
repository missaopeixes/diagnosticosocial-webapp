import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Evento, IEvento } from '@app/evento/evento';
import { IQuestionario, IQuestionarioDaEntrevista } from '@app/questionario/questionario';
import { Resposta } from '@app/resposta/resposta';

const routes = {
  listar: (pagina: number, itensPorPagina?: number) => `/eventos/?${ListagemHelper.paginacao.queryParams(pagina, itensPorPagina)}`,
  escpecifico: (id: number) => `/eventos/${id}`,
  criar: () => `/eventos/`,
  todos: () => `/eventos/todos/`,
  questionarios: (id: number) => `/eventos/${id}/questionarios/`,
  mock: (id: number) => `/eventos/${id}/preencher-mock`,
  relatorio: (idEvento: number) => `/eventos/${idEvento}/relatorio`,
  relatorioPergunta: (idEvento: number, idPergunta: number) => `/eventos/${idEvento}/pergunta/${idPergunta}/relatorio`,
  respostas: (idEvento: number, idPergunta: number) => `/eventos/${idEvento}/pergunta/${idPergunta}/respostas`,
};

@Injectable()
export class EventoService {

  constructor(private _httpClient: HttpClient) { }

  obterPorPagina(pagina: number, itensPorPagina?: number) : Observable<Listagem<Evento>> {
    return this._httpClient.get<Listagem<Evento>>(routes.listar(pagina, itensPorPagina));
  }

  obterTodos() : Observable<IEvento[]> {
    return this._httpClient.get<IEvento[]>(routes.todos());
  }

  obterQuestionarios(idEvento: number) : Observable<IQuestionarioDaEntrevista[]> {
    return this._httpClient.get<IQuestionarioDaEntrevista[]>(routes.questionarios(idEvento));
  }

  obter(id: number) : Observable<IEvento> {
    return this._httpClient.get<IEvento>(routes.escpecifico(id));
  }

  criar(evento: Evento) : Observable<IEvento> {
    return this._httpClient.post<IEvento>(routes.criar(), evento);
  }

  preencherMock(idEvento: number) : Observable<Object> {
    return this._httpClient.post(routes.mock(idEvento), {});
  }

  atualizar(id: number, evento: Evento) : Observable<Evento> {
    return this._httpClient.put<Evento>(routes.escpecifico(id), evento);
  }

  excluir(id: number) : Promise<any> {
    return this._httpClient.delete(routes.escpecifico(id)).toPromise();
  }

  relatorio(id: number, idPergunta?: number) : Observable<Object[]>{
    return !idPergunta ?
      this._httpClient.get<Object[]>(routes.relatorio(id)) :
      this._httpClient.get<Object[]>(routes.relatorioPergunta(id, idPergunta));
  }

  respostas(id: number, idPergunta: number) : Observable<Object[]>{
    return this._httpClient.get<Object[]>(routes.respostas(id, idPergunta));
  }
}
