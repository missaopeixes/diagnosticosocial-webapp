
export enum QtdQuestionarioPorEnquete {
  apenasUm = 1,
  peloMenosUm,
  opcional
}

export class IQtdQuestionarioPorEnquete {
  qtd: QtdQuestionarioPorEnquete
  descricao: string
}

export class QtdQuestionarioPorEnqueteUtils {
  static toString(qtd: QtdQuestionarioPorEnquete) {
    switch(qtd) {
      case QtdQuestionarioPorEnquete.apenasUm: return '1';
      case QtdQuestionarioPorEnquete.peloMenosUm: return '1 ou mais';
      case QtdQuestionarioPorEnquete.opcional: return 'Opcional';
      default: return '';
    }
  }

  static toList() {
    return [{
      qtd: QtdQuestionarioPorEnquete.apenasUm,
      descricao: this.toString(QtdQuestionarioPorEnquete.apenasUm)
    },
    {
      qtd: QtdQuestionarioPorEnquete.peloMenosUm,
      descricao: this.toString(QtdQuestionarioPorEnquete.peloMenosUm)
    },
    {
      qtd: QtdQuestionarioPorEnquete.opcional,
      descricao: this.toString(QtdQuestionarioPorEnquete.opcional)
    }];
  }
}

export class QuestionarioDoEvento {
  idQuestionario: number;
  quantidadePorEnquete: QtdQuestionarioPorEnquete;
}

export interface IEvento {
  id?: number;
  nome: string;

  questionarios: QuestionarioDoEvento[];

  idOrganizacao: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Evento implements IEvento {
  id?: number;
  nome: string;
  questionarios: QuestionarioDoEvento[];
  idOrganizacao: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IEvento) {
    this.nome = '';
    this.questionarios = [];

    Object.assign(this, obj);
  }
}
