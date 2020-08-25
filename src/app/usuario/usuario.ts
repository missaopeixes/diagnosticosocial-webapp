
export interface IUsuario {
  id?: number;
  nome: string;
  login: string;
  email: string;
  senha?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Usuario implements IUsuario {
  id?: number;
  nome: string;
  login: string;
  email: string;
  senha?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IUsuario) {
    this.nome = '';
    this.login = '';
    this.email = '';

    Object.assign(this, obj);
  }
}
