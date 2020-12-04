import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';
import { Resposta } from '@app/resposta/resposta';
import { EntrevistaStorage } from './entrevista.storage';

const routes = {
  listar: (pagina: number, itensPorPagina?: number, filtroIdUsuario?: number, filtroEvento?: string, filtroUsuario?: string, filtroNome?: string, filtroStatus?: string) => {
    let filtros = `&filtroStatus=${filtroStatus}`;
    if (!!filtroIdUsuario) {
      filtros = filtros.concat(`&filtroIdUsuario=${filtroIdUsuario}`);
    }
    if (!!filtroEvento) {
      filtros = filtros.concat(`&filtroEvento=${filtroEvento}`);
    }
    if (!!filtroUsuario) {
      filtros = filtros.concat(`&filtroUsuario=${filtroUsuario}`);
    }
    if (!!filtroNome) {
      filtros = filtros.concat(`&filtroNome=${filtroNome}`);
    }
    return `/entrevistas/?${ListagemHelper.paginacao.queryParams(pagina, itensPorPagina)}${filtros}`;
  },
  listarTodos: () => `/entrevistas/todos`,
  especifica: (id: number) => `/entrevistas/${id}`,
  criar: () => `/entrevistas/`,
  respostas: (idEntrevista: number, idQuestionarioRespondido: number) => `/entrevistas/${idEntrevista}/questionario-respondido/${idQuestionarioRespondido}/respostas`,
  questionario: (id: number) => `/entrevistas/${id}/questionario-respondido`,
  questionarioEspecico: (idEntrevista: number, id: number) => `/entrevistas/${idEntrevista}/questionario-respondido/${id}`,
  resposta: (id: number, idResposta: number) => `/entrevistas/${id}/respostas/${idResposta}`
};

@Injectable()
export class EntrevistaService {

  private _offline = false;

  constructor(
    private _httpClient: HttpClient,
    private _entrevistaStorage: EntrevistaStorage
    ) { }

  public get offline() : boolean {
    return this._offline;
  }
  public set offline(val: boolean) {
    this._offline = val;
  }

  obterPorPagina(pagina: number,
    itensPorPagina?: number,
    filtroIdUsuario?: number,
    filtroEvento?: string,
    filtroUsuario?: string,
    filtroNome?: string,
    filtroStatus?: string,
    ) : Observable<Listagem<Entrevista>> {
    return this._httpClient.get<Listagem<Entrevista>>(
      routes.listar(pagina, itensPorPagina, filtroIdUsuario, filtroEvento, filtroUsuario, filtroNome, filtroStatus));
  }

  listarOffline() : Entrevista[] {
    return this._entrevistaStorage.listar();
  }

  obterTodos() : Observable<IEntrevista[]> {
    return this._httpClient.get<IEntrevista[]>(routes.listarTodos());
  }

  obterEspecifica(id: number) : Observable<IEntrevista> {
    if (this.offline) {
      return new Observable<IEntrevista>(observer => {
        observer.next(this._entrevistaStorage.obter(id));
        observer.complete();
      });
    }

    return this._httpClient.get<IEntrevista>(routes.especifica(id));
  }

  criar(entrevista: Entrevista) : Observable<IEntrevista> {
    if (this.offline) {
      return new Observable<IEntrevista>(observer => {
        observer.next(this._entrevistaStorage.criar(entrevista));
        observer.complete();
      });
    }
    return this._httpClient.post<IEntrevista>(routes.criar(), entrevista);
  }

  atualizar(id: number, entrevista: Entrevista) : Observable<Entrevista> {
    if (this.offline) {
      return new Observable<Entrevista>(observer => {
        observer.next(this._entrevistaStorage.atualizar(id, entrevista));
        observer.complete();
      });
    }

    return this._httpClient.put<Entrevista>(routes.especifica(id), entrevista);
  }

  excluir(id: number) : Promise<any> {
    if (this.offline) {
      return new Promise<any>(res => {
        this._entrevistaStorage.excluir(id);
        res();
      });
    }

    return this._httpClient.delete(routes.especifica(id)).toPromise();
  }

  obterRespostas(idEntrevista: number, idQuestionarioRespondido: number) : Observable<Resposta[]> {
    if (this.offline) {
      return new Observable<Resposta[]>(observer => {
        observer.next(this._entrevistaStorage.obterRespostas(idEntrevista, idQuestionarioRespondido));
        observer.complete();
      });
    }

    return this._httpClient.get<Resposta[]>(routes.respostas(idEntrevista, idQuestionarioRespondido))
  }

  criarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) : Observable<QuestionarioRespondido> {
    if (this.offline) {
      questionario.idEntrevistaOffline = idEntrevista;
      return new Observable<QuestionarioRespondido>(observer => {
        observer.next(this._entrevistaStorage.salvarQuestionarioRespondido(questionario));
        observer.complete();
      });
    }

    return this._httpClient.post<QuestionarioRespondido>(routes.questionario(idEntrevista), questionario);
  }

  atualizarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) {
    if (this.offline) {
      questionario.idEntrevistaOffline = idEntrevista;
      return new Observable<QuestionarioRespondido>(observer => {
        observer.next(this._entrevistaStorage.atualizarQuestionarioRespondido(questionario));
        observer.complete();
      });
    }

    return this._httpClient.put(routes.questionarioEspecico(idEntrevista, questionario.id), questionario);
  }

  excluirQuestionario(idEntrevista: number, idQuestionarioRespondido: number) : Observable<any> {
    if (this.offline) {
      return new Observable<any>(observer => {
        observer.next(this._entrevistaStorage.excluirQuestionarioRespondido(idEntrevista, idQuestionarioRespondido));
        observer.complete();
      });
    }

    return this._httpClient.delete(routes.questionarioEspecico(idEntrevista, idQuestionarioRespondido));
  }
}
