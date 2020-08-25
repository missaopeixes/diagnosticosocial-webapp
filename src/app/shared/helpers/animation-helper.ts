import { Injectable } from '@angular/core';

declare var $: any;

const TABLE_SPLASH_NEW_TIME = 3000;

@Injectable({
  providedIn: 'root'
})
export class AnimationHelper {

  constructor() { }

  static table = {

    splashNew(tableId: string, last: boolean = false) {
      setTimeout(() => {
        const tr = last ? $(tableId).find('tbody tr:last')[0] : $(tableId).find('tbody tr')[0];
        $(tr).addClass('splash-success');
        setTimeout(() => {
          $(tr).removeClass('splash-success');
  
        }, TABLE_SPLASH_NEW_TIME);
      });
    }
  }
}
