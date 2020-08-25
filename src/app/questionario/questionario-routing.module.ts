import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { QuestionarioListagemComponent } from './questionario-listagem/questionario-listagem.component';
import { QuestionarioEspecificoComponent } from './questionario-especifico/questionario-especifico.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/questionarios', pathMatch: 'full' },
    { path: 'questionarios', component: QuestionarioListagemComponent, data: { title: 'Questionários' } },
    { path: 'questionarios/:id', component: QuestionarioEspecificoComponent, data: { title: 'Questionário específico' } },
    { path: 'questionarios/novo', component: QuestionarioEspecificoComponent, data: { title: 'Questionário específico' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class QuestionarioRoutingModule { }
