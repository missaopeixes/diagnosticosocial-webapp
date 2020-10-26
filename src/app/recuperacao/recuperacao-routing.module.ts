import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { RecuperacaoComponent } from './recuperacao.component';
import { ValidacaoComponent } from './recuperacao-validacao/validacao.component';

const routes: Routes = [
  { path: 'recuperacao', component: RecuperacaoComponent, data: { title: extract('Recuperação') } },
  { path: 'recuperacao/validacao', component: ValidacaoComponent, data: { title: extract('Validação') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RecuperacaoRoutingModule { }
