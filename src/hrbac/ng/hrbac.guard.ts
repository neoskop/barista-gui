import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { HierachicalRoleBaseAccessControl } from '../hrbac';
import { RouteResource } from './route-resource';
import { RoleStore } from './role-store';

@Injectable()
export class HrbacGuard implements CanActivate {
  
  constructor(protected hrbac : HierachicalRoleBaseAccessControl, protected roleStore : RoleStore) {
  
  }
  
  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : Promise<boolean> | boolean {
    const resourceId : string|undefined = route.data['resourceId'];
    const privilege : string|null = route.data['privilege'] || null;
    
    if(!resourceId) {
      throw new Error(`resourceId is required for HrbacGuard, "${resourceId}" given.`)
    }
    
    const resource = new RouteResource(resourceId, route, state);
    
    return this.hrbac.isAllowed(this.roleStore.getRole(), resource, privilege);
  }
}
