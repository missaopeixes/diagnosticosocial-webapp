import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organizacao, IOrganizacao } from '@app/organizacao/organizacao';
import { IUsuario } from '@app/usuario/usuario';

const routes = {
  especifico: (id: number) => `/organizacoes/${id}`,
  criar: () => `/auth/cadastro/`,
};

@Injectable({
  providedIn: 'root'
})
export class OrganizacaoService {

  constructor(private _httpClient: HttpClient) { }

  obter(id: number) : Observable<IOrganizacao> {
    return this._httpClient.get<IOrganizacao>(routes.especifico(id));
  }

  criar(dados: any) : Observable<any> {
    return this._httpClient.post<any>(routes.criar(), dados);
  }
}
