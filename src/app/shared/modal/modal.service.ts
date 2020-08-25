import { Injectable } from '@angular/core';

declare var $: any;

const MODAL_TIMEOUT = 3000;

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  open(id: string) {
    return new Promise((res, rej) => {
      if (!id) {
        return rej('O id da modal deve ser informado.');
      }

      $(id).on('shown.bs.modal', () => {
        $(id).find('[autofocus]').focus();
        res();
      });

      $(id).modal('show');

      setTimeout(() => {
        rej('Erro ao abrir modal ' + id + ', tempo de espera excedido.');
      }, MODAL_TIMEOUT);
    })
  }

  close(id: string) {
    return new Promise((res, rej) => {
      if (!id) {
        return rej('O id da modal deve ser informado.');
      }

      $(id).on('hidden.bs.modal', () => {
        res();
      });

      $(id).modal('hide');

      setTimeout(() => {
        rej('Erro ao fechar modal ' + id + ', tempo de espera excedido.');
      }, MODAL_TIMEOUT);
    })
  }
}
