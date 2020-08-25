import { Pergunta } from "@app/pergunta/pergunta";
import { QtdQuestionarioPorEnquete } from "@app/evento/evento";

export interface IQuestionario {
  id?: number;
  nome: string;

  perguntas: Pergunta[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionarioDaEntrevista {
  id?: number;
  nome: string;

  perguntas: Pergunta[];
  quantidadePorEnquete: QtdQuestionarioPorEnquete;
  ordem: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Questionario implements IQuestionario {
  id?: number;
  nome: string;
  perguntas: Pergunta[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IQuestionario) {
    this.nome = '';
    this.perguntas = [];

    Object.assign(this, obj);
  }
}

export class QuestionarioDaEntrevista implements IQuestionarioDaEntrevista {
  id?: number;
  nome: string;
  perguntas: Pergunta[];
  quantidadePorEnquete: QtdQuestionarioPorEnquete;
  ordem: number;
  createdAt?: Date;
  updatedAt?: Date;

  qtdRespondidos: number;

  constructor(obj?: IQuestionarioDaEntrevista) {
    this.nome = '';
    this.perguntas = [];
    this.quantidadePorEnquete = QtdQuestionarioPorEnquete.opcional;
    this.ordem = 0;
    this.qtdRespondidos = 0;

    Object.assign(this, obj);
  }
}