import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pergunta } from '../pergunta';

export interface PerguntaEspecificaHelperOptions {
  completeLabel?: string,
  completeFn?: Function,
  pergunta?: Pergunta
}

@Injectable()
export class PerguntaEspecificaHelper {
  private subject = new Subject<PerguntaEspecificaHelperOptions>();

  abrir(opt: PerguntaEspecificaHelperOptions) {
    this.subject.next(opt);
  }

  observable(): Observable<PerguntaEspecificaHelperOptions> {
    return this.subject.asObservable();
  }
}