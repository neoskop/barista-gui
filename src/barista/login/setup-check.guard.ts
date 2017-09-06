import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Action, DispatcherService } from '../services/dispatcher.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SetupCheckGuard implements CanActivate {
  constructor(protected dispatcher : DispatcherService) {
  
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const isSetup = state.url.startsWith('/setup');
    
    return this.dispatcher.dispatch(new SetupCheckAction(isSetup));
  }
}

export class SetupCheckAction extends Action<boolean> {
  constructor(public isSetup : boolean) {
    super();
  }
}
