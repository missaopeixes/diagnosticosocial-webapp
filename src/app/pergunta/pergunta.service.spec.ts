import { TestBed, inject } from '@angular/core/testing';

import { PerguntaService } from './pergunta.service';

describe('PerguntaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerguntaService]
    });
  });

  it('should be created', inject([PerguntaService], (service: PerguntaService) => {
    expect(service).toBeTruthy();
  }));
});
