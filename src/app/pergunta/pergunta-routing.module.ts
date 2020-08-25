import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { PerguntaListagemComponent } from './pergunta-listagem/pergunta-listagem.component';

const routes: Routes = [
  Route.withShell([
    { path: 'perguntas', component: PerguntaListagemComponent, data: { title: 'Perguntas' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PerguntaRoutingModule { }
