import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CREDENTIALS_KEY, Credentials } from '../authentication/authentication.service';
/**
 * Inclui header de autenticação em todas as requisições quando usuário está autenticado.
 */
@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {

  constructor(/*private authService: AuthenticationService*/) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtLocal: Credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY));
    const jwtSession: Credentials = JSON.parse(sessionStorage.getItem(CREDENTIALS_KEY));

    if (jwtSession && jwtSession.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtSession.token}`
        }
      });
    }
    else if (jwtLocal && jwtLocal.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtLocal.token}`
        }
      });
    }

    return next.handle(request);
  }

}
