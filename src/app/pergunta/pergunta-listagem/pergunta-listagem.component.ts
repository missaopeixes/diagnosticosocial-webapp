import { Component, OnInit } from '@angular/core';
import { Listagem } from '../../shared/listagem';
import { Pergunta, TipoResposta } from '../../pergunta/pergunta';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../shared/modal/modal.service';
import { PerguntaService } from '../../pergunta/pergunta.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

const ITENS_POR_PAGINA = 10;
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
    private _toastrService: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: ModalService) {
  }

  ngOnInit() {
    this.listagem = new Listagem<Pergunta>();
    this.exibeFiltro = true;

    this.formFiltro = this._formBuilder.group({
      descricao: ['']
    });

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
    this._perguntaService.obterPorPagina(this.listagem.pagina,
      ITENS_POR_PAGINA)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Pergunta>) => {
      console.log('resultado', listagem);
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
    console.log('TODO!');
    // this.salvando = true;
    // this._perguntaService.excluir(this.perguntaExclusao.id)
    // .then(() => {
    //   _.remove(this.listagem.conteudo, (obj) => {
    //     return obj.id === this.perguntaExclusao.id;
    //   })
    //   this.listagem.total--;
    //   this._toastrService.success('Pergunta excluida com sucesso.', 'Ok');
    //   this.salvando = false;
    //   this._modalService.close(ID_MODAL_EXCLUSAO);
    // })
    // .catch(({error}) => {
    //   this._toastrService.error(error, 'Ops!');
    //   this.salvando = false;
    // });
  }

  novo() {
    this._router.navigate(['/perguntas/novo']);
  }

  visualizar(pergunta: Pergunta) {
    this._router.navigate([`/perguntas/${pergunta.id}`]);
  }

  formatDate(utc: string) {
    return moment(utc).format('DD/MM/YY HH:mm');
  }

  tipoResposta(tipo: number) {
    return Pergunta.tipoRespostaTexto(tipo);
  }
}
