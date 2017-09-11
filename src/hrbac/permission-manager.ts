import { Injectable } from '@angular/core';
import { Role, Resource, AssertionFunction, Assertion } from "./types";
import { RoleManager } from './role-manager';


enum Type {
  Deny,
  Allow
}

type TRole = string|null;
type TResource = string|null;

class ACE {
  constructor(public readonly type : Type,
              public readonly privileges : Set<string>|null,
              public readonly assertion : Assertion) {}
}

class ACL extends Map<TResource, ACE[]>{
  constructor() {
    super();
  }
  
  add(role : TResource, ace : ACE) {
    if(!this.has(role)) {
      this.set(role, []);
    }
    this.get(role).push(ace);
  }
  
  static create<K, V>(arr? : [ K, V ][]) : ACL {
    const map = new Map<K, V>(arr);
    Object.setPrototypeOf(map, ACL.prototype);
    
    return map as any;
  }
}

class ACLS extends Map<TRole, ACL> {
  
  get(role : TRole) : ACL {
    if(!this.has(role)) {
      this.set(role, ACL.create());
    }
    
    return super.get(role);
  }
  
  
  static create<K, V>(arr? : [ K, V ][]) : ACLS {
    const map = new Map<K, V>(arr);
    Object.setPrototypeOf(map, ACLS.prototype);
    
    return map as any;
  }
}

@Injectable()
export class PermissionManager {
  protected acls = ACLS.create();
  
  protected add(type : Type,
                role : Role|string|null = null,
                resource : Resource|string|null = null,
                privilege : string[]|string|null = null,
                assertion : AssertionFunction|Assertion|null = null) {
    const roleId : TRole = role && (role as Role).roleId || role as string;
    const resourceId : TResource = resource && (resource as Resource).resourceId || resource as string;
    if(typeof assertion === 'function') {
      assertion = new Assertion(assertion);
    }
    
    if(typeof privilege === 'string') {
      privilege = [ privilege ];
    }
    
    const privileges : Set<string>|null = privilege && new Set(privilege);
    
    this.acls.get(roleId).add(resourceId, new ACE(type, privileges, assertion));
  }
  
  allow(role? : Role|string|null,
        resource? : Resource|string|null,
        privilege? : string[]|string|null,
        assertion? : AssertionFunction|Assertion|null) : void {
    this.add(Type.Allow, role, resource, privilege, assertion);
  }
  
  deny(role? : Role|string|null,
       resource? : Resource|string|null,
       privilege? : string[]|string|null,
       assertion? : AssertionFunction|Assertion|null) : void {
    this.add(Type.Deny, role, resource, privilege, assertion);
  }
  
  getAcesForRolesAndResource(roles : string[], resource : Resource) : ACE[] {
    let result : ACE[] = [];
    
    for(const [ role, acl ] of this.acls) {
      for(const r of roles) {
        if(null === role || r === role) {
          for(const [ res, aces ] of acl) {
            if(null === res || res === resource.resourceId) {
              result.push(...aces);
            }
          }
        }
      }
    }
    
    return result;
  }
}
