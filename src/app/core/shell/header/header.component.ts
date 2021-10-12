import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';

import { AuthenticationService, Credentials } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';

const ID_ORGANIZACAO_MODAL = '#ds-organizacao-modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  credenciais: Credentials | null;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private _authenticationService: AuthenticationService,
              private _modalService: ModalService) {
  }

  ngOnInit() {
    this.credenciais = this._authenticationService.credentials;
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  verOrganizacao() {
    this._modalService.open(ID_ORGANIZACAO_MODAL);
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.nome : null;
  }

  get organizationName(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.organizacao.nome : null;
  }

  get organizationCreateDate(): string | null {
    const credentials = this.authenticationService.credentials;
    let date = new Date(credentials.organizacao.createdAt);
    let zeroM = (date.getUTCMonth() + 1) < 10 ? '0' : '';
    let str = date.getUTCDate()+"/"+zeroM+(date.getUTCMonth() + 1)+"/"+date.getUTCFullYear();
    return credentials ? str : null;
  }

}
