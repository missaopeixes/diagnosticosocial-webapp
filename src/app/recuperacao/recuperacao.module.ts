import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RecuperacaoRoutingModule } from './recuperacao-routing.module';
import { RecuperacaoComponent } from './recuperacao.component';
import { RecuperacaoService } from './recuperacao.service';
import { Usuario } from '@app/usuario/usuario';
import { ValidacaoComponent } from './recuperacao-validacao/validacao.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    RecuperacaoRoutingModule
  ],
  declarations: [
    RecuperacaoComponent,
    ValidacaoComponent
  ],
  providers: [
    RecuperacaoService
  ]
})
export class RecuperacaoModule { }

export class ResultadoSolicitacao {

  public mensagem?: string;
  public conteudo?: any;

  constructor(){ }
}

export class ResultadoValidacao {

  public mensagem?: string;
  public usuario?: Usuario;
  public conteudo?: any;

  constructor(){ }
}