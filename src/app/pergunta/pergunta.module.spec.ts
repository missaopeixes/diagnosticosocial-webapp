import { PerguntaModule } from './pergunta.module';

describe('PerguntaModule', () => {
  let perguntaModule: PerguntaModule;

  beforeEach(() => {
    perguntaModule = new PerguntaModule();
  });

  it('should create an instance', () => {
    expect(perguntaModule).toBeTruthy();
  });
});
