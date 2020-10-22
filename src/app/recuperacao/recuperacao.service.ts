import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '@app/usuario/usuario';

const routes = {
  solicitar: () => `/auth/solicitacao`,
  validar: (token: string) => `/auth/validacao?token=${token}`,
  alterar: () => `/auth/alteracaoDeSenha`
};

@Injectable()
export class RecuperacaoService {

  constructor(private _httpClient: HttpClient) { }

  solicitarRecuperacao(email: string) : Observable<any> {
    return this._httpClient.post<any>(routes.solicitar(), {email});
  }

  validarRecuperacao(token: string) : Observable<any> {
    return this._httpClient.get<any>(routes.validar(token));
  }

  alterarSenha(senha: string, confirmaSenha: string, usuario: Usuario) : Observable<any> {
    return this._httpClient.put<any>(routes.alterar(), {senha, confirmaSenha, usuario});
  }

}
