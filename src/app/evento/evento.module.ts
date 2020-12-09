import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgbModule, NgbModal, NgbActiveModal, NgbTypeaheadModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { QuestionarioModule } from '@app/questionario/questionario.module';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { EventoListagemComponent } from './evento-listagem/evento-listagem.component';
import { EventoEspecificoComponent } from './evento-especifico/evento-especifico.component';
import { EventoDiagnosticoComponent } from './evento-diagnostico/evento-diagnostico.component';
import { EventoService } from './evento.service';
import { EventoStorage } from './evento.storage';
import { EventoRoutingModule } from './evento-routing.module';
import { EventoEspecificoHelper } from './evento-especifico/evento-especifico.helper';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { TruncatePipe } from '@app/shared/truncate-pipe';
import { CountoModule } from 'angular2-counto';
import { EventoRespostasComponent } from './evento-respostas/evento-respostas.component';
import { EventoRespostasHelper } from './evento-respostas/evento-respostas.helper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    NgbModule,
    NgbTypeaheadModule,
    QuestionarioModule,
    EventoRoutingModule,
    NgxChartsModule,
    CountoModule
  ],
  declarations: [
    EventoListagemComponent,
    EventoEspecificoComponent,
    EventoDiagnosticoComponent,
    EventoRespostasComponent
  ],
  providers: [
    NgbModal,
    NgbActiveModal,
    NgbTypeahead,
    QuestionarioService,
    EventoStorage,
    EventoService,
    EventoEspecificoHelper,
    EventoRespostasHelper
  ]
})
export class EventoModule { }
