import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgbModule, NgbModal, NgbActiveModal, NgbTypeaheadModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { QuestionarioListagemComponent } from './questionario-listagem/questionario-listagem.component';
import { QuestionarioEspecificoComponent } from './questionario-especifico/questionario-especifico.component';
import { PerguntaModule } from '@app/pergunta/pergunta.module';

import { QuestionarioRoutingModule } from './questionario-routing.module';
import { QuestionarioService } from './questionario.service';
import { PerguntaService } from '@app/pergunta/pergunta.service';

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
    PerguntaModule,

    QuestionarioRoutingModule
  ],
  declarations: [
    QuestionarioListagemComponent,
    QuestionarioEspecificoComponent
  ],
  providers: [
    NgbModal,
    NgbActiveModal,
    NgbTypeahead,
    QuestionarioService,
    PerguntaService
  ]
})
export class QuestionarioModule { }
