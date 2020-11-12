import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  adm = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService) {
  }

  ngOnInit() {
    setTimeout(() => this.adm = JSON.parse(window.sessionStorage.getItem('adm')), 800);
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

}
