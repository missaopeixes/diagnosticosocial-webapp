import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountoModule }  from 'angular2-counto';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { UsuarioModule } from './usuario/usuario.module';
import { QuestionarioModule } from './questionario/questionario.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerguntaEspecificaHelper } from '@app/pergunta/pergunta-especifica/pergunta-especifica.helper';
import { EventoModule } from './evento/evento.module';
import { EntrevistaModule } from './entrevista/entrevista.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerguntaModule } from './pergunta/pergunta.module';
import { RecuperacaoModule } from './recuperacao/recuperacao.module';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    CountoModule,

    LoginModule,
    RecuperacaoModule,
    HomeModule,
    AboutModule,
    UsuarioModule,
    QuestionarioModule,
    EventoModule,
    EntrevistaModule,
    PerguntaModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxChartsModule
  ],
  declarations: [AppComponent],
  providers: [
    PerguntaEspecificaHelper
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
