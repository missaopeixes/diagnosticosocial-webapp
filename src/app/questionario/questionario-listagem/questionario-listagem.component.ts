import { Component, OnInit } from '@angular/core';
import { Listagem } from '@app/shared/listagem';
import { Questionario } from '@app/questionario/questionario';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@app/shared/modal/modal.service';
import { QuestionarioService } from '@app/questionario/questionario.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';

const ID_MODAL_EXCLUSAO = '#ds-questionario-modal-exclusao';

@Component({
  selector: 'app-questionario-listagem',
  templateUrl: './questionario-listagem.component.html',
  styleUrls: ['./questionario-listagem.component.scss']
})
export class QuestionarioListagemComponent implements OnInit {

  public listagem: Listagem<Questionario>;
  public carregando: boolean;
  public erroListagem: boolean;
  public salvando: boolean;
  public questionarioExclusao: Questionario;

  constructor(
    private _questionarioService: QuestionarioService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _modalService: ModalService) {
  }

  ngOnInit() {
    this.listagem = new Listagem<Questionario>();

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
    this._questionarioService.obterPorPagina(this.listagem.pagina)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Questionario>) =>
      refresh ? this.listagem.atualizar(listagem) : this.listagem.incrementar(listagem),
      () => this.erroListagem = true
    );
  }

  confirmarExclusao(obj: Questionario) {
    this.questionarioExclusao = obj;
    this._modalService.open(ID_MODAL_EXCLUSAO);
  }

  excluir() {
    this.salvando = true;
    this._questionarioService.excluir(this.questionarioExclusao.id)
    .then(() => {
      _.remove(this.listagem.conteudo, (obj) => {
        return obj.id === this.questionarioExclusao.id;
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

  novo() {
    this._router.navigate(['/questionarios/novo']);
  }

  visualizar(questionario: Questionario) {
    this._router.navigate([`/questionarios/${questionario.id}`]);
  }

}
