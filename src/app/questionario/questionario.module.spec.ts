import { QuestionarioModule } from './questionario.module';

describe('QuestionarioModule', () => {
  let questionarioModule: QuestionarioModule;

  beforeEach(() => {
    questionarioModule = new QuestionarioModule();
  });

  it('should create an instance', () => {
    expect(questionarioModule).toBeTruthy();
  });
});
