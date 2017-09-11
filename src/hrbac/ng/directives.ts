import { Directive, OnChanges, OnDestroy, TemplateRef, ViewContainerRef, SimpleChanges, Input, Injectable } from '@angular/core';
import { HierachicalRoleBaseAccessControl } from '../hrbac';
import { NgIf } from '@angular/common';
import { Subscription } from "rxjs/Subscription";
import { RoleStore } from "./role-store";
import { Resource, Role } from '../types';

@Injectable()
export abstract class AbstractDirective implements OnChanges, OnDestroy {
  resource : string|Resource;
  privilege : string|null = null;
  role : string|Role|null = null;
  
  protected ngIf : NgIf;
  protected subscription : Subscription;
  
  protected abstract readonly trueValue : boolean;
  
  constructor(protected hrbac : HierachicalRoleBaseAccessControl,
              protected roleStore : RoleStore,
              viewContainer : ViewContainerRef,
              templateRef : TemplateRef<AbstractDirective>) {
    this.ngIf = new NgIf(viewContainer, templateRef as TemplateRef<any>);
    
    this.subscription = this.roleStore.roleChange.subscribe(() => {
      this.updateView();
    });
  }
  
  
  ngOnChanges(changes : SimpleChanges) : void {
    this.updateView();
  }
  
  updateView() {
    this.ngIf.ngIf =
      this.trueValue === this.hrbac.isAllowed(this.role || this.roleStore.getRole(), this.resource, this.privilege);
  }
  
  
  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }
}

@Directive({
  selector: '[neoAllowed],[neo-allowed]',
  inputs: [
    'resource: neoAllowed',
    'privilege: neoAllowedPrivilege',
    'role: neoAllowedRole'
  ]
})
export class AllowedDirective extends AbstractDirective {
  protected readonly trueValue = true;
}

@Directive({
  selector: '[neoDenied],[neo-denied]',
  inputs: [
    'resource: neoDenied',
    'privilege: neoDeniedPrivilege',
    'role: neoDeniedRole'
  ]
})
export class DeniedDirective extends AbstractDirective {
  protected readonly trueValue = false;
}


