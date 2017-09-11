import { Injectable } from '@angular/core';
import { RoleManager } from './role-manager';
import { Assertion, Role, Resource, AssertionFunction } from "./types";
import { PermissionManager } from './permission-manager';

enum Type {
  Deny,
  Allow
}

type TRole = string|null;
type TResource = string|null;
type TPrivileges = Set<string>|null;
type TAssertion = Assertion|null;
type TResourcePrivilege = { privileges: TPrivileges, assertion: TAssertion, type: Type };
type TResourceMap = Map<TResource, TResourcePrivilege[]>
type TRoleMap = Map<TRole, TResourceMap>

@Injectable()
export class HierachicalRoleBaseAccessControl {
  
  // protected roles = new Map<string, Set<string>>();
  // protected acls : TRoleMap = new Map();
  
  constructor(public readonly roleManager : RoleManager,
              public readonly permissionManager : PermissionManager) {
  }
  
  
  inherit(role : string|Role, ...parents : (string|Role)[]) : this {
    this.roleManager.inherit(role, parents);
    // const roleId = (role as Role).roleId || role as string;
    //
    // if(!this.roles.has(roleId)) {
    //   this.roles.set(roleId, new Set<string>());
    // }
    //
    // for(const parent of parents) {
    //   const parentId = (parent as Role).roleId || parent as string;
    //
    //   this.roles.get(roleId).add(parentId);
    // }
    
    return this;
  }
  
  // getParentRolesOf(role : string|Role) : string[] {
  //   const roleId = (role as Role).roleId || role as string;
  //
  //   const queue = [ roleId ];
  //   const parents = new Set<string>();
  //   let i = 0;
  //
  //   while(i < queue.length) {
  //     parents.add(queue[i]);
  //
  //     if(this.roles.has(queue[i])) {
  //       queue.push(...Array.from(this.roles.get(queue[i])));
  //     }
  //     ++i;
  //   }
  //
  //   return Array.from(parents);
  // }
  
  // protected add(type : Type,
  //               role : Role|string|null = null,
  //               resource : Resource|string|null = null,
  //               privilege : string[]|string|null = null,
  //               assertion : AssertionFunction|Assertion|null = null) {
  //   const roleId : TRole = role && (role as Role).roleId || role as string;
  //   const resourceId : TResource = resource && (resource as Resource).resourceId || resource as string;
  //   if(typeof assertion === 'function') {
  //     assertion = new Assertion(assertion);
  //   }
  //
  //   if(!this.acls.has(roleId)) {
  //     this.acls.set(roleId, new Map());
  //   }
  //
  //   if(!this.acls.get(roleId)!.has(resourceId)) {
  //     this.acls.get(roleId)!.set(resourceId, []);
  //   }
  //
  //   if(typeof privilege === 'string') {
  //     privilege = [ privilege ];
  //   }
  //
  //   const privileges : Set<string>|null = privilege && new Set(privilege);
  //
  //   this.acls.get(roleId)!.get(resourceId)!.push({ privileges, assertion, type })
  // }
  
  allow(role? : Role|string|null,
        resource? : Resource|string|null,
        privilege? : string[]|string|null,
        assertion? : AssertionFunction|Assertion|null) : this {
    this.permissionManager.allow(role, resource, privilege, assertion);
    // this.add(Type.Allow, role, resource, privilege, assertion);
    //
    return this;
  }
  
  deny(role? : Role|string|null,
       resource? : Resource|string|null,
       privilege? : string[]|string|null,
       assertion? : AssertionFunction|Assertion|null) : this {
    this.permissionManager.deny(role, resource, privilege, assertion);
    // this.add(Type.Deny, role, resource, privilege, assertion);
    //
    return this;
  }
  
  isAllowed(role : Role|string, resource : Resource|string, privilege : string|null = null) : boolean {
    if(typeof role === 'string') {
      role = new Role(role);
    }
    if(typeof resource === 'string') {
      resource = new Resource(resource);
    }
    
    const roles = this.roleManager.getRecursiveParentRolesOf(role).reverse();
    const aces = this.permissionManager.getAcesForRolesAndResource(roles, resource);
    
    let result : Type = Type.Deny;
    for(const ace of aces) {
      if((null === ace.privileges || ace.privileges.has(privilege))
      && (null === ace.assertion || ace.assertion.assert(this, role, resource, privilege))) {
        result = ace.type;
      }
    }
    
    return result === Type.Allow;
    
    // return this.permissionManager.isAllowed(role, resource, privilege);
    // if(typeof role === 'string') {
    //   role = new Role(role);
    // }
    // if(typeof resource === 'string') {
    //   resource = new Resource(resource);
    // }
    //
    // let result : Type|undefined;
    //
    // const roles = this.roleManager.getParentRolesOf(role).reverse();
    //
    // for(const [ rol, resources ] of this.acls) {
    //   for(const _role of roles) {
    //     if(null === rol || rol === _role) {
    //       for(const [ res, privileges ] of resources) {
    //         if(null === res || res === resource.resourceId) {
    //           for(const { privileges: priv, assertion, type } of privileges) {
    //             if(null === priv || priv.has(privilege)) {
    //               if(null === assertion || assertion.assert(this, role, resource, privilege)) {
    //                 result = type;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    //
    // return Type.Allow === result;
  }
  
  isDenied(role : Role|string, resource : Resource|string, privilege? : string|null) : boolean {
    return !this.isAllowed(role, resource, privilege);
  }
}
