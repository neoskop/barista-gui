import { Injectable } from '@angular/core';
import { Role } from './types';

@Injectable()
export class RoleManager {
  
  protected roles = new Map<string, Set<string>>();
  
  inherit(role : Role|string, parents : (Role|string)[]) : void {
    const roleId = (role as Role).roleId || role as string;
  
    if(!this.roles.has(roleId)) {
      this.roles.set(roleId, new Set<string>());
    }
  
    for(const parent of parents) {
      const parentId = (parent as Role).roleId || parent as string;
    
      this.roles.get(roleId).add(parentId);
    }
  }
  
  getParentRolesOf(role : Role) : Set<string> {
    return this.roles.get(role.roleId);
  }
  
  getRecursiveParentRolesOf(role : Role) : string[] {

    const queue = [ role.roleId ];
    const parents = new Set<string>();
    let i = 0;

    while(i < queue.length) {
      parents.add(queue[i]);

      if(this.roles.has(queue[i])) {
        queue.push(...Array.from(this.roles.get(queue[i])));
      }
      ++i;
    }

    return Array.from(parents);
  }
}
