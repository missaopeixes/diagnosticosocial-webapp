import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable, forkJoin } from 'rxjs';
import { Evento, IEvento } from '@app/evento/evento';
import { IQuestionario, IQuestionarioDaEntrevista, QuestionarioDaEntrevista } from '@app/questionario/questionario';
import { Resposta } from '@app/resposta/resposta';
import { Storage } from '@app/core/storage/storage';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { Pergunta } from '@app/pergunta/pergunta';

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

  constructor(
    private _httpClient: HttpClient,
    private _questionarioService: QuestionarioService,
    private _store: Storage) { }

  obterPorPagina(pagina: number, itensPorPagina?: number) : Observable<Listagem<Evento>> {
    return this._httpClient.get<Listagem<Evento>>(routes.listar(pagina, itensPorPagina));
  }

  obterTodos(offline = false) : Observable<IEvento[]> {
    if (offline) {
      return new Observable<IEvento[]>(observer => {
        observer.next([this.obterHabilitadoOffline()]);
        observer.complete();
      });
    }

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

  obterHabilitadoOffline() : Evento | null {
    return this._store.eventoOffline;
  }

  habilitarOffline(evento: Evento) : Promise<void> {
    return new Promise((res, rej) => {

      this.obterQuestionarios(evento.id)
      .subscribe((questionarios: QuestionarioDaEntrevista[]) => {

        let perguntasStore : Pergunta[] = [];

        let observables = questionarios.map(q => this._questionarioService.obterPerguntas(q.id));
        forkJoin(observables)
        .subscribe((response: Pergunta[][]) => {

          response.forEach(perguntas => perguntas.forEach(p => perguntasStore.push(p)));

          this._store.perguntas = perguntasStore;
          this._store.questionarios = questionarios;
          this._store.eventoOffline = evento;
          res();

        },({error}) => rej(error));
      },({error}) => rej(error));
    })
  }
}
