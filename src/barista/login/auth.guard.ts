import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Action, DispatcherService } from "../services/dispatcher.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected dispatcher : DispatcherService) {
  
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const isLogin = state.url.startsWith('/login');
    
    return this.dispatcher.dispatch(new AuthCheckAction(isLogin));
  }
}

export class AuthCheckAction extends Action<boolean> {
  constructor(public isLogin : boolean) {
    super();
  }
}
