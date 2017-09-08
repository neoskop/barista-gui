import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SetupCheckAction } from "./setup.actions";
import { Dispatcher } from '../../dispatcher/dispatcher';

@Injectable()
export class SetupCheckGuard implements CanActivate {
  constructor(protected dispatcher : Dispatcher) {
  
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const isSetup = state.url.startsWith('/setup');
    
    return this.dispatcher.dispatch(new SetupCheckAction(isSetup));
  }
}


