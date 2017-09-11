import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { HierachicalRoleBaseAccessControl } from '../hrbac';
import { RoleStore } from './role-store';
import { Subscription } from 'rxjs/Subscription';
import { Resource, Role } from '../types';

@Injectable()
export abstract class AbstractPipe implements PipeTransform, OnDestroy {
  protected subscription : Subscription;
  
  protected abstract readonly trueValue : boolean;
  
  constructor(protected hrbac : HierachicalRoleBaseAccessControl,
              protected roleStore : RoleStore,
              protected cdr : ChangeDetectorRef) {
    this.subscription = this.roleStore.roleChange.subscribe(() => {
      this.cdr.markForCheck();
    });
  }
  
  transform(resource : string|Resource, privilege : string|null = null, role : string|Role|null = null) : any {
    return this.trueValue === this.hrbac.isAllowed(role || this.roleStore.getRole(), resource, privilege)
  }
  
  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }
}

@Pipe({ name: 'neoAllowed', pure: false })
export class AllowedPipe extends AbstractPipe {
  protected readonly trueValue = true;
}

@Pipe({ name: 'neoDenied', pure: false })
export class DeniedPipe extends AbstractPipe {
  protected readonly trueValue = false;
}
