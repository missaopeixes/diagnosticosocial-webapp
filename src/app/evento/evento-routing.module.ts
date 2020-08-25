import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { EventoListagemComponent } from './evento-listagem/evento-listagem.component';
import { EventoDiagnosticoComponent } from './evento-diagnostico/evento-diagnostico.component';

const routes: Routes = [
  Route.withShell([
    { path: 'eventos', component: EventoListagemComponent, data: { title: 'Eventos' } },
    { path: 'eventos/:id/diagnostico', component: EventoDiagnosticoComponent, data: { title: 'Diagnóstico' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EventoRoutingModule { }
