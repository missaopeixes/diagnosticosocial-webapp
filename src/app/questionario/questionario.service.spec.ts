import { TestBed, inject } from '@angular/core/testing';

import { QuestionarioService } from './questionario.service';

describe('QuestionarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionarioService]
    });
  });

  it('should be created', inject([QuestionarioService], (service: QuestionarioService) => {
    expect(service).toBeTruthy();
  }));
});
