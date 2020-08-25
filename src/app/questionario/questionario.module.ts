import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgbModal, NgbActiveModal, NgbTypeaheadModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { QuestionarioListagemComponent } from './questionario-listagem/questionario-listagem.component';
import { QuestionarioRoutingModule } from './questionario-routing.module';
import { QuestionarioService } from './questionario.service';
import { QuestionarioEspecificoComponent } from './questionario-especifico/questionario-especifico.component';
import { PerguntaModule } from '@app/pergunta/pergunta.module';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import { PerguntaEspecificaComponent } from '@app/pergunta/pergunta-especifica/pergunta-especifica.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    NgbTypeaheadModule,
    PerguntaModule,

    QuestionarioRoutingModule
  ],
  declarations: [
    QuestionarioListagemComponent,
    QuestionarioEspecificoComponent,
    PerguntaEspecificaComponent
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
