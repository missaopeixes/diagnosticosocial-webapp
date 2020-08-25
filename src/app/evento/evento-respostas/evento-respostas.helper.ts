import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Evento } from '../evento';
import { Pergunta } from '@app/pergunta/pergunta';

export interface EventoRespostasHelperOptions {
  evento: Evento,
  pergunta: Pergunta,
}

@Injectable()
export class EventoRespostasHelper {
  private subject = new Subject<EventoRespostasHelperOptions>();

  abrir(opt: EventoRespostasHelperOptions) {
    this.subject.next(opt);
  }

  observable(): Observable<EventoRespostasHelperOptions> {
    return this.subject.asObservable();
  }
}