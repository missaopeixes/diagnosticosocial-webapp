import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpcaoResposta } from '@app/opcaoResposta/opcaoResposta';

const routes = {
  pesquisar: (termo: string) => `/opcoes-resposta/pesquisa/?termo=${termo}`,
  criar: () => `/opcoes-resposta/`
};

@Injectable()
export class RespostaService {

  constructor(private _httpClient: HttpClient) { }

  pesquisar(termo: string) : Observable<OpcaoResposta[]> {

    return this._httpClient.get<OpcaoResposta[]>(routes.pesquisar(termo));
  }

  criar(descricao: string) : Observable<OpcaoResposta> {

    return this._httpClient.post<OpcaoResposta>(routes.criar(), {descricao});
  }
}
