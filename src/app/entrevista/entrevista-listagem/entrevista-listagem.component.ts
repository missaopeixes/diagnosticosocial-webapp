import { Component, OnInit } from '@angular/core';
import { Listagem } from '@app/shared/listagem';
import { Entrevista, IEntrevista, QuestionarioRespondido } from '@app/entrevista/entrevista';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@app/shared/modal/modal.service';
import { EntrevistaService } from '@app/entrevista/entrevista.service';
import { finalize } from 'rxjs/operators';
import { Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { AuthenticationService, Credentials } from '@app/core/authentication/authentication.service';
import { EventoService } from '@app/evento/evento.service';
import { Observable } from 'rxjs';
import { EntrevistaStorage } from '../entrevista.storage';

declare var $: any;

const ITENS_POR_PAGINA = 15;
const ID_MODAL_EXCLUSAO = '#ds-entrevista-modal-exclusao';

@Component({
  selector: 'app-entrevista-listagem',
  templateUrl: './entrevista-listagem.component.html',
  styleUrls: ['./entrevista-listagem.component.scss']
})
export class EntrevistaListagemComponent implements OnInit {

  public listagem: Listagem<Entrevista>;
  public listagemOffline: Entrevista[] = [];
  public carregando: boolean;
  public erroListagem: boolean;
  public salvando: boolean;
  public entrevistaExclusao: Entrevista;
  public formFiltro: FormGroup;
  public exibeFiltro: boolean;
  public entrevistaExclusaoOffline: boolean;
  public credenciais: Credentials;
  public progressEntrevistas: number;

  constructor(
    private _entrevistaService: EntrevistaService,
    private _entrevistaStorage: EntrevistaStorage,
    private _toastrService: ToastrService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _eventoService: EventoService,
    private _authenticationService: AuthenticationService) {
  }

  get administrador() : boolean {
    return this.credenciais ? this.credenciais.administrador : false;
  }

  get idUsuario() : number {
    return this.credenciais ? this.credenciais.id : 0;
  }

  ngOnInit() {
    this.listagem = new Listagem<Entrevista>();
    this.credenciais = this._authenticationService.credentials;

    this.formFiltro = this._formBuilder.group({
      idUsuario: this.administrador ? [undefined] : [this.idUsuario],
      evento: [''],
      usuario: [''],
      nome: [''],
      status: ['']
    });
    this.formFiltro.controls['status'].setValue('3');

    this.exibeFiltro = $(window).width() >= 720;

    this.obterListagemOffline();
    this.obterListagem();
  }

  obterListagemOffline() {
    this.listagemOffline = this._entrevistaService.listarOffline();
  }

  obterListagem(refresh: boolean = false) {
    if (refresh) {
      this.listagem.pagina = 1;
    }
    else {
      this.listagem.pagina++;
    }

    this.carregando = true;
    this._entrevistaService.obterPorPagina(
      this.listagem.pagina,
      ITENS_POR_PAGINA,
      this.formFiltro.value.idUsuario,
      this.formFiltro.value.evento,
      this.formFiltro.value.usuario,
      this.formFiltro.value.nome,
      this.formFiltro.value.status)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Entrevista>) =>
      refresh ? this.listagem.atualizar(listagem) : this.listagem.incrementar(listagem),
      () => this.erroListagem = true
    );
  }

  confirmarExclusao(obj: Entrevista, offline = false) {
    this.entrevistaExclusao = obj;
    this.entrevistaExclusaoOffline = offline;
    this._modalService.open(ID_MODAL_EXCLUSAO);
  }

  excluirOffline() {
    this._entrevistaService.offline = true;

    let questionariosRespondidos = this._entrevistaStorage.obter(this.entrevistaExclusao.id).questionariosRespondidos;

    this._entrevistaService.excluir(this.entrevistaExclusao.id)
    .then(() => {
      _.remove(this.listagemOffline, (obj) => obj.id === this.entrevistaExclusao.id);
      this._entrevistaService.offline = false;
      this._modalService.close(ID_MODAL_EXCLUSAO);
    })
    .catch((err) => {
      this._toastrService.error('Ocorreu um erro ao excluir entrevista não sincronizada.', 'Ops!');
      this._entrevistaService.offline = false;
    });
  }

  excluir() {
    this.salvando = true;
    this._entrevistaService.excluir(this.entrevistaExclusao.id)
    .then(() => {
      _.remove(this.listagem.conteudo, (obj) => {
        return obj.id === this.entrevistaExclusao.id;
      })
      this.listagem.total--;
      this._toastrService.success('Entrevista excluida com sucesso.', 'Ok');
      this.salvando = false;
      this._modalService.close(ID_MODAL_EXCLUSAO);
    })
    .catch(({error}) => {
      this._toastrService.error(error, 'Ops!');
      this.salvando = false;
    });
  }

  nova() {
    this._router.navigate(['/entrevistas/nova']);
  }

  novaOffline() {
    this._router.navigate(['/entrevistas/nova'], {
      queryParams: {
        offline: true
      }
    });
  }

  visualizar(entrevista: Entrevista, offline = false) {
    let params : Params = {};
    if (offline) {
      params.offline = true;
    }
    this._router.navigate([`/entrevistas/${entrevista.id}`], {
      queryParams: params
    });
  }

  private sincronizarQuestionariosRespondidos(idEntrevista: number, questionariosRespondidos: QuestionarioRespondido[]) {

    let promises = questionariosRespondidos.map((questionarioRespondido: QuestionarioRespondido) => {
      return this._entrevistaService.criarQuestionario(idEntrevista, questionarioRespondido).toPromise();
    });

    return Promise.all(promises);
  }

  sincronizarEntrevista(entrevista: Entrevista) {
    let questionariosRespondidos = this._entrevistaStorage.obter(entrevista.id).questionariosRespondidos;

    return new Promise((res, rej) => {

      this._entrevistaService.offline = false;
      this._entrevistaService.criar(entrevista).toPromise()
      .then(resp => {
        _.remove(this.listagemOffline, entrevista);
        this.sincronizarQuestionariosRespondidos(resp.id, questionariosRespondidos)
        .then(() => {

          this._entrevistaService.offline = true;
          this._entrevistaService.excluir(entrevista.id)
          .then(() => {
            this._entrevistaService.offline = false;
            this.progressEntrevistas++;
            res();
          })
          .catch((err) => {
            this._toastrService.error('Ocorreu um erro ao remover as entrevistas não sincronizadas.', 'Ops!');
            this._entrevistaService.offline = false;
          });
        })
        .catch(rej)
      })
      .catch(rej);
    })
  }

  private sincronizarEntrevistas(entrevistas: Entrevista[]) {
    let promises = entrevistas.map((entrevista: Entrevista) => this.sincronizarEntrevista(entrevista));

    return Promise.all(promises);
  }

  sincronizar(){
    this.carregando = true;

    this.sincronizarEntrevistas(this.listagemOffline).then(() => {
      this.carregando = false;

      this.listagem = new Listagem();
      this.obterListagem();
    })
    .catch((err) => {
      this._toastrService.error(err, 'Ops!');
      this.carregando = false;
    });
  }

  formatDate(utc: string) {
    return moment(utc).format('DD/MM/YY HH:mm');
  }

  abrirOpcoes(id: number){
    const display = $('#entrevista-mobile-opcoes-'+id).attr('style');
    if (display == null || display == '') {
      $('#entrevista-mobile-opcoes-'+id).slideUp(100);
    }
    else{
      $('#entrevista-mobile-opcoes-'+id).slideDown(100);
    }
  }

  offlineHabilitado() {
    return !!this._eventoService.obterHabilitadoOffline();
  }

  entrevistasOfflineEmAndamento() {
    return this.listagemOffline.filter(e => !e.concluida);
  }
}
