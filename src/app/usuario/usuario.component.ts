import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '@app/usuario/usuario.service';
import { Listagem } from '@app/shared/listagem';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Usuario } from '@app/usuario/usuario';
import { ModalService } from '@app/shared/modal/modal.service';
import { AnimationHelper } from '@app/shared/helpers/animation-helper';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { embeddedViewStart } from '@angular/core/src/render3/instructions';

const ID_MODAL = '#ds-usuario-modal';
const ID_TABLE = '#ds-usuario-table';
const ID_MODAL_EXCLUSAO = '#ds-usuario-modal-exclusao';

const confirmarSenha = (formularioSenha: FormGroup) => {
  const senha = formularioSenha.controls.senha.value;
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
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  public listagem: Listagem<Usuario>;
  public erro: string;
  public carregando: boolean;
  public salvando: boolean;
  public usuarioExclusao: Usuario;
  public usuarioEdicao: Usuario;
  public form: FormGroup;
  public formSenha: FormGroup;
  public exibirValidacao: boolean;

  constructor(
    private _usuarioService: UsuarioService,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _modalService: ModalService) {
  }

  private _initForm(edicao = false) {
    this.formSenha = this._formBuilder.group({
      senha: ['', Validators.required],
      confirmacao: ['', Validators.required]
    }, {
      validator: confirmarSenha.bind(this)
    });

    this.form = this._formBuilder.group({
      nome: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      formSenha: !edicao ? this.formSenha : null
    });
    this.exibirValidacao = false;
  }

  ngOnInit() {
    this.listagem = new Listagem<Usuario>();

    this._initForm();
    this.obterListagem();
  }

  obterListagem(refresh: boolean = false) {
    if (refresh) {
      this.listagem.pagina = 1;
    }
    else {
      this.listagem.pagina++;
    }

    this.carregando = true;
    this._usuarioService.obterPorPagina(this.listagem.pagina)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Usuario>) =>
      refresh ? this.listagem.atualizar(listagem) : this.listagem.incrementar(listagem),
      () => this.erro = 'Ocorreu um erro ao carregar os usuários.'
    );
  }

  salvar() {
    if (!this.form.valid) {
      this.exibirValidacao = true;
      return;
    }
    if (!!this.usuarioEdicao) {
      return this.editar();
    }

    const usuario = new Usuario({
      nome: this.form.value.nome,
      login: this.form.value.login,
      email: this.form.value.email,
      senha: this.form.value.formSenha.senha
    });

    this.salvando = true;
    this._usuarioService.criar(usuario)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe((obj: Usuario) => {
      this.listagem.conteudo.unshift(obj);
      AnimationHelper.table.splashNew(ID_TABLE);
      this._modalService.close(ID_MODAL);
    }, ({error}) => {
      this._toastrService.error(error, 'Ops!');
    });
  }

  editar() {
    const usuario = new Usuario({
      id: this.usuarioEdicao.id,
      nome: this.form.value.nome,
      login: this.form.value.login,
      email: this.form.value.email
    });

    this.salvando = true;
    this._usuarioService.atualizar(usuario)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe(() => {
      let obj = _.find(this.listagem.conteudo, {id: this.usuarioEdicao.id});
      Object.assign(obj, usuario);
      this.usuarioEdicao = null;
      this._modalService.close(ID_MODAL);
    }, ({error}) => {
      this._toastrService.error(error, 'Ops!');
    });
  }

  novo() {
    this._initForm();
    this.usuarioEdicao = null;
    this._modalService.open(ID_MODAL);
  }

  visualizar(usuario: Usuario) {
    this.usuarioEdicao = usuario;
    this._initForm(true);
    this.form.controls['nome'].setValue(usuario.nome);
    this.form.controls['login'].setValue(usuario.login);
    this.form.controls['email'].setValue(usuario.email);

    this._modalService.open(ID_MODAL);
  }

  confirmarExclusao(obj: Usuario) {
    this.usuarioExclusao = obj;
    this._modalService.open(ID_MODAL_EXCLUSAO);
  }

  excluir() {
    this.salvando = true;
    this._usuarioService.excluir(this.usuarioExclusao.id)
    .then(() => {
      _.remove(this.listagem.conteudo, (obj) => {
        return obj.id === this.usuarioExclusao.id;
      })
      this._toastrService.success('Questionário removido com sucesso.', 'Ok');
      this.salvando = false;
      this._modalService.close(ID_MODAL_EXCLUSAO);
    })
    .catch(({error}) => {
      this._toastrService.error(error, 'Ops!');
      this.salvando = false;
    });
  }

}
