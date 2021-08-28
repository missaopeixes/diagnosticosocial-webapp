import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OrganizacaoRoutingModule } from './organizacao-routing.module';
import { OrganizacaoComponent } from './organizacao.component';
import { OrganizacaoService } from './organizacao.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    OrganizacaoRoutingModule
  ],
  declarations: [
    OrganizacaoComponent
  ],
  providers: [
    NgbModal,
    NgbActiveModal,
    OrganizacaoService
  ]
})
export class OrganizacaoModule { }
