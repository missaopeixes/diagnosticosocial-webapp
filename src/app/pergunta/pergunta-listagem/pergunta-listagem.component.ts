import { Component, OnInit } from '@angular/core';
import { Listagem } from '../../shared/listagem';
import { Pergunta, TipoResposta } from '../../pergunta/pergunta';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../shared/modal/modal.service';
import { PerguntaService } from '../../pergunta/pergunta.service';
import { PerguntaEspecificaHelper } from '@app/pergunta/pergunta-especifica/pergunta-especifica.helper';

import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

const ITENS_POR_PAGINA = 15;
const ID_MODAL_EXCLUSAO = '#ds-pergunta-modal-exclusao';

@Component({
  selector: 'app-pergunta-listagem',
  templateUrl: './pergunta-listagem.component.html',
  styleUrls: ['./pergunta-listagem.component.scss']
})
export class PerguntaListagemComponent implements OnInit {

  public listagem: Listagem<Pergunta>;
  public carregando: boolean;
  public erroListagem: boolean;
  public salvando: boolean;
  public perguntaExclusao: Pergunta;
  public formFiltro: FormGroup;
  public exibeFiltro: boolean;

  constructor(
    private _perguntaService: PerguntaService,
    private _perguntaEspecificaHelper: PerguntaEspecificaHelper,
    private _toastrService: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: ModalService) {
  }

  ngOnInit() {
    this.listagem = new Listagem<Pergunta>();
    this.exibeFiltro = true;

    this.formFiltro = this._formBuilder.group({
      descricao: [''],
      utilizadas: ['']
    });
    this.formFiltro.controls['utilizadas'].setValue(false);

    this.obterListagem();
  }

  obterListagem(refresh: boolean = false) {
    if (refresh) {
      this.listagem.pagina = 1;
    }
    else {
      this.listagem.pagina++;
    }
    console.log("descricao: ", this.formFiltro.value.descricao, "utilizadas: ", this.formFiltro.value.utilizadas);
    this.carregando = true;
    this._perguntaService.obterPorPagina(this.listagem.pagina,
      ITENS_POR_PAGINA,
      this.formFiltro.value.descricao,
      this.formFiltro.value.utilizadas)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Pergunta>) => {
      return refresh ? this.listagem.atualizar(listagem) : this.listagem.incrementar(listagem);
    },
      () => this.erroListagem = true
    );
  }

  confirmarExclusao(obj: Pergunta) {
    this.perguntaExclusao = obj;
    this._modalService.open(ID_MODAL_EXCLUSAO);
  }

  excluir() {
    this.salvando = true;
    this._perguntaService.excluir(this.perguntaExclusao)
    .pipe(finalize(() =>
      this.salvando = false
    ))
    .subscribe((resultado) => {
      _.remove(this.listagem.conteudo, (obj) => {
        return obj.id === this.perguntaExclusao.id;
      });
      this.listagem.total--;

      const msg = typeof resultado === 'string' ? resultado : 'Pergunta excluída com sucesso.'
      this._toastrService.success(msg, 'Ok!');
      
      this.salvando = false;
      this._modalService.close(ID_MODAL_EXCLUSAO);
    },
    (error) => {
      this.salvando = false;
      const msg = typeof error.error === 'string' ? error.error : 'Ocorreu um erro ao excluir a pergunta.'
      this._toastrService.error(msg, 'Ops!');
      this._modalService.close(ID_MODAL_EXCLUSAO);
    }
  );
}

  novo() {
    this._router.navigate(['/perguntas/novo']);
  }

  visualizar(pergunta: Pergunta) {

    if (!pergunta.id) {
      return;
    }

    this._perguntaEspecificaHelper.abrir({
      pergunta: pergunta,
      completeFn: (obj: Pergunta) => {
        pergunta = obj;
      }
    });
  }

  perguntaConcluida(pergunta: Pergunta) {
    if (!pergunta.id) {
      return;
    }
    else {
      this.obterListagem(true);
    }
  }

  formatDate(utc: string) {
    return moment(utc).format('DD/MM/YY HH:mm');
  }

  tipoResposta(tipo: number) {
    return Pergunta.tipoRespostaTexto(tipo);
  }
}
