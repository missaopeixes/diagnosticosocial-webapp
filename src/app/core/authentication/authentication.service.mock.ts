import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

interface Organizacao {
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}
export class MockAuthenticationService {

  credentials: Credentials | null = {
    id: 1,
    login: 'test',
    administrador: false,
    organizacao: null,
    token: '123'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      id: 1,
      administrador: true,
      login: context.username,
      organizacao: null,
      token: '123456'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

}
