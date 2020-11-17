import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';
import { Resposta } from '@app/resposta/resposta';

const routes = {
  listar: (pagina: number, itensPorPagina?: number, filtroEvento?: string, filtroUsuario?: string, filtroNome?: string, filtroConcluida?: boolean) => {
    let filtros = `&filtroConcluidas=${!!filtroConcluida}`;
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

  constructor(private _httpClient: HttpClient) { }

  obterPorPagina(pagina: number,
    itensPorPagina?: number,
    filtroEvento?: string,
    filtroUsuario?: string,
    filtroNome?: string,
    filtroConcluida?: boolean,
    ) : Observable<Listagem<Entrevista>> {
    return this._httpClient.get<Listagem<Entrevista>>(
      routes.listar(pagina, itensPorPagina, filtroEvento, filtroUsuario, filtroNome, filtroConcluida));
  }

  obterTodos() : Observable<IEntrevista[]> {
    return this._httpClient.get<IEntrevista[]>(routes.listarTodos());
  }

  obterEspecifica(id: number) : Observable<IEntrevista> {
    return this._httpClient.get<IEntrevista>(routes.especifica(id));
  }

  criar(entrevista: Entrevista) : Observable<IEntrevista> {
    return this._httpClient.post<IEntrevista>(routes.criar(), entrevista);
  }

  atualizar(id: number, entrevista: Entrevista) : Observable<Entrevista> {
    return this._httpClient.put<Entrevista>(routes.especifica(id), entrevista);
  }

  excluir(id: number) : Promise<any> {
    return this._httpClient.delete(routes.especifica(id)).toPromise();
  }

  obterRespostas(idEntrevista: number, idQuestionarioRespondido: number) : Observable<Resposta[]> {
    return this._httpClient.get<Resposta[]>(routes.respostas(idEntrevista, idQuestionarioRespondido))
  }

  criarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) {
    return this._httpClient.post(routes.questionario(idEntrevista), questionario);
  }

  atualizarQuestionario(idEntrevista: number, questionario: QuestionarioRespondido) {
    return this._httpClient.put(routes.questionarioEspecico(idEntrevista, questionario.id), questionario);
  }

  excluirQuestionario(idEntrevista: number, idQuestionarioRespondido: number) {
    return this._httpClient.delete(routes.questionarioEspecico(idEntrevista, idQuestionarioRespondido));
  }

  // desvincularResposta(id: number, idResposta: number) : Observable<any> {
  //   return this._httpClient.delete(routes.resposta(id, idResposta));
  // }
}
