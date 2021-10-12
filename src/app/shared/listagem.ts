
export interface IListagem {
  conteudo: any[];
  pagina: number;
  itensPorPagina: number;
  total: number;
}

export class Listagem<T> implements IListagem {

  public conteudo: T[];

  constructor(
    public pagina: number = 0,
    public itensPorPagina: number = 15,
    public total: number = 0
  ) {
    this.conteudo = [];
  }

  incrementar(listagem: Listagem<T>) {
    this.pagina = listagem.pagina;
    this.itensPorPagina = listagem.itensPorPagina;
    this.total = listagem.total;
    listagem.conteudo.forEach((obj) => {
      this.conteudo.push(obj);
    });
  }

  atualizar(listagem: Listagem<T>) {
    Object.assign(this, listagem);
  }
}

export class ListagemHelper {

  static paginacao = {
    queryParams(pagina: number, itensPorPagina?: number) {
      const page = `pagina=${pagina}`;
      return !itensPorPagina ? page : `${page}&itensPorPagina=${itensPorPagina}`;
    }
  }
}
