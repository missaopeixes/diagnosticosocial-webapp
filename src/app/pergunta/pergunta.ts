import { OpcaoResposta } from "@app/opcaoResposta/opcaoResposta";

export enum TipoResposta {
  MultiplaEscolha = 1,
  Texto,
  Numero,
  MultiplaSelecao
}

export interface IPergunta {
  id?: number;
  descricao: string;
  tipoResposta: TipoResposta;
  opcoesResposta: OpcaoResposta[];
  idOrganizacao: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pergunta implements IPergunta {
  id?: number;
  descricao: string;
  tipoResposta: TipoResposta;
  opcoesResposta: OpcaoResposta[];
  idOrganizacao: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IPergunta) {
    this.descricao = '';
    this.tipoResposta = TipoResposta.MultiplaEscolha;
    this.opcoesResposta = [];

    Object.assign(this, obj);
  }

  static tipoRespostaTexto(tipo: TipoResposta): string {
    switch (tipo) {
      case TipoResposta.MultiplaEscolha: return 'Múltipla escolha';
      case TipoResposta.Numero: return 'Número';
      case TipoResposta.Texto: return 'Texto';
      case TipoResposta.MultiplaSelecao: return 'Múltipla seleção';
      default: return '';
    }
  }

  possuiOpcoes() : boolean {
    switch (this.tipoResposta) {
      case TipoResposta.MultiplaEscolha:
      case TipoResposta.MultiplaSelecao:
        return true;
      default:
        return false;
    }
  }
}
