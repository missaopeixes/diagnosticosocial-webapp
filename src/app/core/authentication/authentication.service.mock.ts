import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {

  credentials: Credentials | null = {
    id: 1,
    login: 'test',
    administrador: false,
    token: '123'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      id: 1,
      administrador: true,
      login: context.username,
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
