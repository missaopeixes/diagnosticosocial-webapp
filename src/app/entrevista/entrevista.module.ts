import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { NgbModule, NgbModal, NgbActiveModal, NgbTypeaheadModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

import { EntrevistaListagemComponent } from './entrevista-listagem/entrevista-listagem.component';
import { EntrevistaEspecificaComponent } from './entrevista-especifica/entrevista-especifica.component';
import { EntrevistaRoutingModule } from './entrevista-routing.module';
import { EntrevistaService } from './entrevista.service';
// import { EntrevistaEspecificoComponent } from './entrevista-especifico/entrevista-especifico.component';
import { PerguntaModule } from '@app/pergunta/pergunta.module';
import { PerguntaService } from '@app/pergunta/pergunta.service';
import { UsuarioService } from '@app/usuario/usuario.service';
import { TruncatePipe } from '@app/shared/truncate-pipe';
import { EntrevistaStorage } from './entrevista.storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    NgbModule,
    NgbTypeaheadModule,
    PerguntaModule,
    SharedModule,

    EntrevistaRoutingModule
  ],
  declarations: [
    EntrevistaListagemComponent,
    EntrevistaEspecificaComponent
  ],
  providers: [
    NgbModal,
    NgbActiveModal,
    NgbTypeahead,
    EntrevistaStorage,
    EntrevistaService,
    PerguntaService,
    UsuarioService
  ]
})
export class EntrevistaModule { }
