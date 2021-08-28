export interface IOrganizacao {
  id?: number;
  nome: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Organizacao implements IOrganizacao {
  id?: number;
  nome: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IOrganizacao) {
    this.nome = '';
    Object.assign(this, obj);
  }
}
