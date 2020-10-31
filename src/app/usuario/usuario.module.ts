import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuarioService } from '@app/usuario/usuario.service';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    NgbModule,
    SharedModule,
    UsuarioRoutingModule
  ],
  declarations: [
    UsuarioComponent,
    PerfilComponent
  ],
  providers: [
    UsuarioService,
    NgbModal,
    NgbActiveModal
  ]
})
export class UsuarioModule { }
