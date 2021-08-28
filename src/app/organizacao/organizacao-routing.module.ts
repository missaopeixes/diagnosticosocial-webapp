import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { OrganizacaoComponent } from './organizacao.component';

const routes: Routes = [
  { path: 'cadastro', component: OrganizacaoComponent, data: { title: extract('Cadastro') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrganizacaoRoutingModule { }
