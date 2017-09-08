import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { LogoutAction } from '../login/login.actions';
import { Dispatcher } from '../../dispatcher/dispatcher';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(protected dispatcher : Dispatcher) {
  
  }
  
  intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
    const token = localStorage.getItem('Authorization');
    
    if(token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    
    return next.handle(req).do(null, event => {
      if(event instanceof HttpErrorResponse) {
        if(event.status === 401) {
          this.dispatcher.dispatch(new LogoutAction());
        }
      }
    });
  }
}
