
export interface IOpcaoResposta {
  id?: number;
  descricao: string;
  idOrganizacao: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class OpcaoResposta implements IOpcaoResposta {
  id?: number;
  descricao: string;
  idOrganizacao: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IOpcaoResposta) {
    this.descricao = '';

    Object.assign(this, obj);
  }
}
