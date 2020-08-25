import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import { RespostaService } from '@app/opcaoResposta/opcaoResposta.service';
import { PerguntaRoutingModule } from '@app/pergunta/pergunta-routing.module';
import { PerguntaListagemComponent } from '@app/pergunta/pergunta-listagem/pergunta-listagem.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    SharedModule,

    PerguntaRoutingModule
  ],
  declarations: [
    PerguntaListagemComponent
  ],
  providers: [
    PerguntaService,
    RespostaService,

    NgbModal,
    NgbActiveModal,
  ]
})
export class PerguntaModule { }
