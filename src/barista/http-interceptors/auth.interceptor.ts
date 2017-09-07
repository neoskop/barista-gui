import { HttpEvent, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { DispatcherService } from '../services/dispatcher.service';
import { LogoutAction } from '../login/login.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(protected dispatcher : DispatcherService) {
  
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
    
    return next.handle(req).do(event => {
      if(event instanceof HttpHeaderResponse) {
        if(event.status === 401) {
          this.dispatcher.dispatch(new LogoutAction());
        }
      }
    });
  }
}
