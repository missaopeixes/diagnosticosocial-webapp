import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { RecuperacaoService } from './recuperacao.service';
import { ResultadoSolicitacao } from './recuperacao.module';

@Component({
  selector: 'app-recuperacao',
  templateUrl: './recuperacao.component.html',
  styleUrls: ['./recuperacao.component.scss']
})
export class RecuperacaoComponent implements OnInit {

  recForm: FormGroup;
  isLoading = false;
  mensagem: string;

  constructor(private formBuilder: FormBuilder,
              private _toastrService: ToastrService,
              private recuperacaoService: RecuperacaoService) {
    this.createForm();
  }

  ngOnInit() { }

  enviar() {
    this.isLoading = true;
    this.recuperacaoService.solicitarRecuperacao(this.recForm.value.email)
    .pipe(finalize(() =>
      this.isLoading = false
    ))
    .subscribe((response: ResultadoSolicitacao) => {
      const msg = typeof response.mensagem === 'string' ? response.mensagem : 'Enviado.'
      this._toastrService.success(msg, 'Ok!');
    }, (error: any) => {
      const msg = typeof error === 'string' ? error : 'Ocorreu um erro ao enviar o email.'
      this._toastrService.error(msg, 'Ops!');
    });
  }

  private createForm() {
    this.recForm = this.formBuilder.group({
      email: ['', Validators.required],
      remember: false
    });
  }

}
