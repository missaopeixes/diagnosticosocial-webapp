
export interface IResposta {
  id?: number;
  idEntrevista?: number;

  idQuestionario: number;
  idPergunta: number;

  idOpcaoEscolhida?: number;
  respostaEmTexto?: string;
  respostaEmNumero?: number;

  observacoes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class Resposta implements IResposta {
  id?: number;
  idEntrevista?: number;

  idQuestionario: number;
  idPergunta: number;

  idOpcaoEscolhida?: number;
  respostaEmTexto?: string;
  respostaEmNumero?: number;

  observacoes?: string;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(obj?: IResposta) {
    Object.assign(this, obj);
  }
}