import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '@app/usuario/usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { Usuario } from '@app/usuario/usuario';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService,
              private _usuarioService: UsuarioService,
              private _toastrService: ToastrService) {
    this.createForm();
  }

  ngOnInit() { }

  login() {
    this.isLoading = true;
    this.authenticationService.login(this.loginForm.value)
    .pipe(
      finalize(() => {
        this.loginForm.markAsPristine();
        this.isLoading = false;
      }))
    .subscribe((credenciais) => {
      log.debug(`${credenciais.login} successfully logged in`);
      this.router.navigate(['/'], { replaceUrl: true });
      this.obterPerfil();
    }, error => {
      log.debug(`Login error: ${error}`);
      this.error = error;
    });
  }
  
  obterPerfil() {
    this._usuarioService.perfil()
    .pipe()
    .subscribe((obj: Usuario) => {
      window.sessionStorage.setItem('adm', JSON.stringify(obj.administrador));
      window.sessionStorage.setItem('idUsuario', JSON.stringify(obj.id));
      if (!obj.administrador) this.router.navigate(['/entrevistas'], { replaceUrl: true });
    }, ({error}) => {
      this._toastrService.error(error, 'Ops!');
    });
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    });
  }

}
