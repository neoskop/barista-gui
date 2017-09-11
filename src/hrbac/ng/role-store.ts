import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Role } from '../types';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export const DEFAULT_ROLE = new InjectionToken<string|Role>('DefaultRole');

@Injectable()
export class RoleStore {
  protected _roleChange = new Subject<Role>();
  readonly roleChange : Observable<Role> = this._roleChange;
  
  protected _currentRole : Role|null = null;
  
  constructor(@Optional() @Inject(DEFAULT_ROLE) role : string|Role) {
    if(role) {
      this.setRole(role);
    }
  }
  
  setRole(role : string|Role) {
    if(typeof role === 'string') {
      role = new Role(role);
    }
    
    this._currentRole = role;
    this._roleChange.next(role);
  }
  
  getRole() : Role|null {
    return this._currentRole;
  }
}
