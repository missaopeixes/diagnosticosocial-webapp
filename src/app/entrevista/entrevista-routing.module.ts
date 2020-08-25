import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { EntrevistaListagemComponent } from './entrevista-listagem/entrevista-listagem.component';
import { EntrevistaEspecificaComponent } from './entrevista-especifica/entrevista-especifica.component';

const routes: Routes = [
  Route.withShell([
    { path: 'entrevistas', component: EntrevistaListagemComponent, data: { title: 'Entrevistas' } },
    { path: 'entrevistas/:id', component: EntrevistaEspecificaComponent, data: { title: 'Entrevista' } },
    { path: 'entrevistas/novo', component: EntrevistaEspecificaComponent, data: { title: 'Nova entrevista' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EntrevistaRoutingModule { }
