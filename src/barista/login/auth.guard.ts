import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthCheckAction } from './login.actions';
import { Dispatcher } from '../../dispatcher/dispatcher';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected dispatcher : Dispatcher) {
  
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const isLogin = state.url.startsWith('/login');
    
    return this.dispatcher.dispatch(new AuthCheckAction(isLogin));
  }
}
