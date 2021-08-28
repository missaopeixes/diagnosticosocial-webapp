import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '@app/usuario/usuario.service';
import { OrganizacaoService } from './organizacao.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';
import { Organizacao } from './organizacao';
import { Usuario } from '@app/usuario/usuario';
import { ModalService } from '@app/shared/modal/modal.service';
import { confirmarSenha } from '@app/shared/confirmarSenha';

const log = new Logger('Login');

const ID_MODAL_SOBRE = '#ds-login-modal-sobre';

@Component({
  selector: 'app-organizacao',
  templateUrl: './organizacao.component.html',
  styleUrls: ['./organizacao.component.scss']
})
export class OrganizacaoComponent implements OnInit {

  public version: string = environment.version;
  public error: string;
  public organizacaoCadastro: Organizacao;
  public usuarioCadastro: Usuario;
  public formCadastro: FormGroup;
  public formSenha: FormGroup;
  public isLoading = false;
  public exibirValidacao: boolean;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private _organizacaoService: OrganizacaoService,
              private _usuarioService: UsuarioService,
              private _toastrService: ToastrService,
              private _modalService: ModalService,
              private _router: Router) {
    this.organizacaoCadastro = new Organizacao();
    this.usuarioCadastro = new Usuario();
    this.createForm();
    this.preencher();
  }

  ngOnInit() { }

  cadastrar() {
    this.isLoading = true;

    this.organizacaoCadastro = new Organizacao({
      nome: this.formCadastro.value.nomeOrganizacao
    });

    this.usuarioCadastro = new Usuario({
      nome: this.formCadastro.value.nome,
      login: this.formCadastro.value.username,
      email: this.formCadastro.value.email,
      senha: this.formSenha.value.senha,
      administrador: true
    });

    let dados = {
      nomeOrganizacao: this.organizacaoCadastro.nome,
      nome: this.usuarioCadastro.nome,
      login: this.usuarioCadastro.login,
      email: this.usuarioCadastro.email,
      senha: this.usuarioCadastro.senha
    }

    this._organizacaoService.criar(dados)
    .pipe(
      finalize(() => {
        this.formCadastro.markAsPristine();
        this.formSenha.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe((response) => {

        this._router.navigate(['/login']);
        this._toastrService.success('Cadastro feito. Agora é só realizar o login para começar!', 'OK!');

    }, error => {
      this.exibirValidacao = true;
      this.formCadastro.markAsPristine();
      this.formSenha.markAsPristine();
      this.isLoading = false;

      const msg = typeof error.error === 'string' ? error.error : 'Preencha os campos corretamente.'
      this._toastrService.error(msg, 'Ops!');
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

  preencher() {
    this.formCadastro.controls['nomeOrganizacao'].setValue(this.organizacaoCadastro.nome);
    this.formCadastro.controls['nome'].setValue(this.usuarioCadastro.nome);
    this.formCadastro.controls['username'].setValue(this.usuarioCadastro.login);
    this.formCadastro.controls['email'].setValue(this.usuarioCadastro.email);
    this.formSenha.controls['senha'].setValue(this.usuarioCadastro.senha);
    this.formSenha.controls['confirmacao'].setValue('');
  }

  private createForm() {
    this.formSenha = this.formBuilder.group({
      senha: ['', Validators.required],
      confirmacao: ['', Validators.required]
    }, {
      validator: confirmarSenha.bind(this)
    });

    this.formCadastro = this.formBuilder.group({
      nomeOrganizacao: ['', Validators.required],
      nome: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.formSenha
    });
    this.exibirValidacao = false;
  }

  verSobre() {
    this._modalService.open(ID_MODAL_SOBRE);
  }

}
