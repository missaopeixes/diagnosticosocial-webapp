import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Pergunta, IPergunta } from '@app/pergunta/pergunta';
import { OpcaoResposta } from '@app/opcaoResposta/opcaoResposta';

const routes = {
  listar: (pagina: number, itensPorPagina?: number, filtroDescricao?: string, filtroUtilizadas?: boolean) => {
    let filtros = `&filtroUtilizadas=${!!filtroUtilizadas}`;
    if (!!filtroDescricao) {
      filtros = filtros.concat(`&filtroDescricao=${filtroDescricao}`);
    }
    return `/perguntas/?${ListagemHelper.paginacao.queryParams(pagina, itensPorPagina)}${filtros}`;
  },
  criar: () => `/perguntas/`,
  pergunta: (id: number) => `/perguntas/${id}`,
  pesquisar: (termo: string) => `/perguntas/pesquisa/?termo=${termo}`,
  opcoesResposta: (id: number) => `/perguntas/${id}/opcoes-resposta`,
  opcaoResposta: (id: number, idResposta: number) => `/perguntas/${id}/opcoes-resposta/${idResposta}`
};

@Injectable()
export class PerguntaService {

  constructor(private _httpClient: HttpClient) { }

  obterPorPagina(pagina: number, itensPorPagina?: number, filtroDescricao?: string, filtroUtilizadas?: boolean) : Observable<Listagem<Pergunta>> {
    return this._httpClient.get<Listagem<Pergunta>>(routes.listar(pagina, itensPorPagina, filtroDescricao, filtroUtilizadas));
  }

  obter(id: number) : Observable<IPergunta> {
    return this._httpClient.get<IPergunta>(routes.pergunta(id));
  }

  criar(pergunta: Pergunta) : Observable<IPergunta> {
    return this._httpClient.post<IPergunta>(routes.criar(), pergunta);
  }

  atualizar(pergunta: Pergunta) : Observable<IPergunta> {
    return this._httpClient.put<IPergunta>(routes.pergunta(pergunta.id), pergunta);
  }

  excluir(pergunta: Pergunta) : Observable<IPergunta> {
    return this._httpClient.delete<IPergunta>(routes.pergunta(pergunta.id));
  }

  pesquisar(termo: string) : Observable<Pergunta[]> {
    return this._httpClient.get<Pergunta[]>(routes.pesquisar(termo));
  }

  criarResposta(id: number, descricao: string) : Observable<OpcaoResposta> {
    return this._httpClient.post<OpcaoResposta>(routes.opcoesResposta(id), {descricao});
  }

  vincularResposta(id: number, idResposta: number) {
    return this._httpClient.put(routes.opcaoResposta(id, idResposta), {});
  }

  desvincularResposta(id: number, idResposta: number) : Observable<any> {
    return this._httpClient.delete(routes.opcaoResposta(id, idResposta));
  }
}
