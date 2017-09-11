import { ModuleWithProviders, NgModule } from '@angular/core';
import { HierachicalRoleBaseAccessControl } from '../hrbac';
import { RoleManager } from '../role-manager';
import { PermissionManager } from '../permission-manager';
import { Role } from '../types';
import { RoleStore, DEFAULT_ROLE } from './role-store';
import { HrbacGuard } from "./hrbac.guard";
import { AllowedDirective, DeniedDirective } from "./directives";
import { AllowedPipe, DeniedPipe } from './pipes';


@NgModule({
  declarations: [
    AllowedDirective,
    DeniedDirective,
    AllowedPipe,
    DeniedPipe
  ],
  providers: [
    HierachicalRoleBaseAccessControl,
    RoleManager,
    PermissionManager,
    RoleStore,
    { provide: DEFAULT_ROLE, useValue: new Role('guest') }
  ],
  exports: [
    AllowedDirective,
    DeniedDirective,
    AllowedPipe,
    DeniedPipe
  ]
})
export class HrbacModule {
  static withRouter() : ModuleWithProviders {
    return {
      ngModule: HrbacModule,
      providers: [
        HrbacGuard
      ]
    }
  }
}
