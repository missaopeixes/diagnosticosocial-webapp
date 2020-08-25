import { RespostaModule } from './opcaoResposta.module';

describe('RespostaModule', () => {
  let opcaoRespostaModule: RespostaModule;

  beforeEach(() => {
    opcaoRespostaModule = new RespostaModule();
  });

  it('should create an instance', () => {
    expect(opcaoRespostaModule).toBeTruthy();
  });
});
