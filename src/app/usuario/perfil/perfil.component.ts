import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '@app/usuario/usuario.service';
import { Listagem } from '@app/shared/listagem';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Usuario } from '@app/usuario/usuario';
import { ModalService } from '@app/shared/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { AuthenticationService } from '@app/core';

const confirmarSenha = (formularioSenha: FormGroup) => {
  const senha = formularioSenha.controls.senhaNova.value;
  const confirmacao = formularioSenha.controls.confirmacao.value;

  if (!confirmacao || confirmacao.length <= 0) {
    return null;
  }

  if (confirmacao !== senha) {
    return {
      confirmacaoInvalida: true
    };
  }

  return null;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public erro: string;
  public carregando: boolean;
  public salvando: boolean;
  public usuario: Usuario;
  public formSenha: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _modalService: ModalService,
    private _authService: AuthenticationService) {
  }

  private _initForm() {
    this.formSenha = this._formBuilder.group({
      senhaAtual: ['', Validators.required],
      senhaNova: ['', Validators.required],
      confirmacao: ['', Validators.required]
    }, {
      validator: confirmarSenha.bind(this)
    });
  }

  ngOnInit() {
    this.usuario = new Usuario();

    this._initForm();
    this.obterPerfil();
  }

  obterPerfil() {
    this.carregando = true;
    this._usuarioService.perfil()
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((obj: Usuario) => {
      this.usuario = obj;
    }, ({error}) => {
      this._toastrService.error(error, 'Ops!');
    });
  }

  alterarSenha() {
    this.salvando = true;
    this._usuarioService.alterarSenha(
      this.formSenha.value.senhaAtual,
      this.formSenha.value.senhaNova)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe(() => {
      this._initForm();
      this._toastrService.success('Senha atualizada.', 'Ok!')
    }, ({error}) => {
      this._toastrService.error(error, 'Ops!');
    });
  }

}
