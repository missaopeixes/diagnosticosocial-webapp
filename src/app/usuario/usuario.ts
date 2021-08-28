
export interface IUsuario {
  id?: number;
  nome: string;
  login: string;
  email: string;
  senha?: string;
  administrador: boolean;
  idOrganizacao?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Usuario implements IUsuario {
  id?: number;
  nome: string;
  login: string;
  email: string;
  senha?: string;
  administrador: boolean;
  idOrganizacao?: number;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IUsuario) {
    this.nome = '';
    this.login = '';
    this.email = '';
    this.administrador = false;

    Object.assign(this, obj);
  }
}
