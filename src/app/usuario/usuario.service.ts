import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listagem, ListagemHelper } from '@app/shared/listagem';
import { Observable } from 'rxjs';
import { Usuario } from '@app/usuario/usuario';

const routes = {
  listar: (pagina: number, itensPorPagina?: number) => `/usuarios/?${ListagemHelper.paginacao.queryParams(pagina, itensPorPagina)}`,
  criar: () => `/usuarios/`,
  cadastrar: () => `/usuarios/cadastro/`,
  especifico: (id: number) => `/usuarios/${id}`,
  perfil: () => `/usuarios/perfil`,
  senha: () => `/usuarios/senha`
};

@Injectable()
export class UsuarioService {

  constructor(private httpClient: HttpClient) { }

  obterPorPagina(pagina: number, itensPorPagina?: number) : Observable<Listagem<Usuario>> {

    return this.httpClient.get<Listagem<Usuario>>(routes.listar(pagina, itensPorPagina));
  }

  criar(usuario: Usuario) : Observable<Usuario> {

    return this.httpClient.post<Usuario>(routes.criar(), usuario);
  }

  cadastrar(usuario: Usuario) : Observable<Usuario> {

    return this.httpClient.post<Usuario>(routes.cadastrar(), usuario);
  }

  atualizar(usuario: Usuario) : Observable<Usuario> {

    return this.httpClient.put<Usuario>(routes.especifico(usuario.id), usuario);
  }

  excluir(id: number) : Promise<any> {

    return this.httpClient.delete(routes.especifico(id)).toPromise();
  }

  perfil() : Observable<Usuario> {

    return this.httpClient.get<Usuario>(routes.perfil());
  }

  alterarSenha(senhaAtual: string, senhaNova: string) : Observable<any> {

    return this.httpClient.put(routes.senha(), {senhaAtual, senhaNova});
  }
}
