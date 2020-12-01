import { Component, OnInit } from '@angular/core';
import { Listagem } from '@app/shared/listagem';
import { Entrevista } from '@app/entrevista/entrevista';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@app/shared/modal/modal.service';
import { EntrevistaService } from '@app/entrevista/entrevista.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { AuthenticationService, Credentials } from '@app/core/authentication/authentication.service';
import { EventoService } from '@app/evento/evento.service';

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
  public carregando: boolean;
  public modoMobile: boolean;
  public erroListagem: boolean;
  public salvando: boolean;
  public entrevistaExclusao: Entrevista;
  public formFiltro: FormGroup;
  public exibeFiltro: boolean;
  public credenciais: Credentials;

  constructor(
    private _entrevistaService: EntrevistaService,
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
      concluida: ['']
    });
    
    if($(window).width() <= 720){
      this.modoMobile = true;
      this.exibeFiltro = false;
      this.formFiltro.controls['concluida'].setValue(false);
    }
    else{
      this.formFiltro.controls['concluida'].setValue(true);
      this.modoMobile = false;
      this.exibeFiltro = true;
    }

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
    this._entrevistaService.obterPorPagina(this.listagem.pagina,
      ITENS_POR_PAGINA,
      this.formFiltro.value.idUsuario,
      this.formFiltro.value.evento,
      this.formFiltro.value.usuario,
      this.formFiltro.value.nome,
      this.formFiltro.value.concluida)
    .pipe(finalize(() =>
      this.carregando = false
    ))
    .subscribe((listagem: Listagem<Entrevista>) =>
      refresh ? this.listagem.atualizar(listagem) : this.listagem.incrementar(listagem),
      () => this.erroListagem = true
    );
  }

  confirmarExclusao(obj: Entrevista) {
    this.entrevistaExclusao = obj;
    this._modalService.open(ID_MODAL_EXCLUSAO);
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

  visualizar(entrevista: Entrevista) {
    this._router.navigate([`/entrevistas/${entrevista.id}`]);
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
    const ev = this._eventoService.obterHabilitadoOffline();
    return ev && ev.id;
  }
}
