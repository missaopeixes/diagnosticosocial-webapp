import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

export const CREDENTIALS_KEY = 'DS_ACCESS_JWT';

export interface Credentials {
  // Customize received credentials here
  login: string;
  token: string;
  validade?: string;
  nome?: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export class Auth {
  username: string;
  token: string;
}

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;

  constructor(private _httpClient: HttpClient) {
    const saved = sessionStorage.getItem(CREDENTIALS_KEY) || localStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      this._credentials = JSON.parse(saved);
    }
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {

    return this._httpClient.post<Credentials>('/auth', {login: context.username, senha: context.password})
    .pipe(
      tap((credenciais: Credentials) => {

        this.setCredentials(credenciais, context.remember);

        return of(credenciais);
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credenciais The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credenciais?: Credentials, remember?: boolean) {
    this._credentials = credenciais || null;

    if (credenciais) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(CREDENTIALS_KEY, JSON.stringify(credenciais));
    } else {
      sessionStorage.removeItem(CREDENTIALS_KEY);
      sessionStorage.removeItem('adm');
      localStorage.removeItem(CREDENTIALS_KEY);
      localStorage.removeItem('adm');
    }
  }

}
