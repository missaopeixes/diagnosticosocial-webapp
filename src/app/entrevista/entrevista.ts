import { Resposta } from "@app/resposta/resposta";

export class IQuestionarioRespondido {
  id?: number;
  idQuestionario: number;
  respostas: Resposta[];
  observacoes?: string;
}
export class QuestionarioRespondido {
  id?: number;
  idQuestionario: number;
  respostas: Resposta[];
  observacoes?: string;

  constructor(obj?: IQuestionarioRespondido) {
    if (!!obj) {
      Object.assign(this, obj);
    }
  }
}

export interface IEntrevista {
  id?: number;
  nome: string;

  idEvento: number;
  idUsuario: number;

  observacoes: string;
  concluida?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Entrevista implements IEntrevista {
  id?: number;

  nome: string;
  idEvento: number;
  idUsuario: number;

  observacoes: string;
  concluida: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IEntrevista) {
    this.nome = '';
    this.observacoes = '';
    this.concluida = false;

    Object.assign(this, obj);
  }
}
