import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Evento } from '../evento';

export interface EventoEspecificoHelperOptions {
  completeLabel?: string,
  completeFn?: Function,
  evento?: Evento
}

@Injectable()
export class EventoEspecificoHelper {
  private subject = new Subject<EventoEspecificoHelperOptions>();

  abrir(opt: EventoEspecificoHelperOptions) {
    this.subject.next(opt);
  }

  observable(): Observable<EventoEspecificoHelperOptions> {
    return this.subject.asObservable();
  }
}