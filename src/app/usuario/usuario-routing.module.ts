import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '@app/core';
import { UsuarioComponent } from './usuario.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/usuarios', pathMatch: 'full' },
    { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuários' } },
    { path: 'perfil', component: PerfilComponent, data: { title: 'Perfil' } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsuarioRoutingModule { }
