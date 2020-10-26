import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { RecuperacaoService } from '../recuperacao.service';
import { ResultadoSolicitacao, ResultadoValidacao } from '../recuperacao.module';
import { Usuario } from '@app/usuario/usuario';

@Component({
  selector: 'app-validacao',
  templateUrl: './validacao.component.html',
  styleUrls: ['./validacao.component.scss']
})
export class ValidacaoComponent implements OnInit {

  templateValidacao = true;
  templateAlteracao = false;

  valForm: FormGroup;
  isLoading = false;
  isErroVal = false;
  token: string;
  usuario: Usuario;
  mensagem: string;

  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private _toastrService: ToastrService,
              private recuperacaoService: RecuperacaoService) {
    this.createForm();
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.get('token')) {

      this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
      
      this.recuperacaoService.validarRecuperacao(this.token)
      .pipe(finalize(() => {
      }))
      .subscribe((response: ResultadoValidacao) => {

        const msg = typeof response.mensagem === 'string' ? response.mensagem : 'Válido.'
        this._toastrService.success(msg, 'Ok!');

        if (response.usuario) {

          this.usuario = response.usuario;

          this.templateValidacao = false;
          this.templateAlteracao = true;

        }else{
          const msg = typeof response.conteudo === 'string' ? response.conteudo : 'Ocorreu um erro ao validar o token.'
          this._toastrService.error(msg, 'Ops!');
          this.isErroVal = true;

        }
      }, (error: any) => {
        const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao validar o token.'
        this._toastrService.error(msg, 'Ops!');
        this.isErroVal = true;

      });
    }else{
      this._toastrService.error('Token não informado!', 'Ops!');
      this.isErroVal = true;
    }
  }

  alterar() {
    this.isLoading = true;
    
    this.recuperacaoService.alterarSenha(this.valForm.value.senha, this.valForm.value.confirmaSenha, this.usuario)
    .pipe(finalize(() => {
      this.isLoading = false;
      
    }))
    .subscribe((response: ResultadoSolicitacao) => {
      const msg = typeof response.mensagem === 'string' ? response.mensagem : 'Alterada!.'
      this._toastrService.success(msg, 'Ok!');
      
    }, (error: any) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao alterar a senha.'
      this._toastrService.error(msg, 'Ops!');

    });
  }

  private createForm() {
    this.valForm = this.formBuilder.group({
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required],
      remember: false
    });
  }

}
