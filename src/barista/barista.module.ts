import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { BaristaRoutingModule } from './barista-routing.module';
import { BaristaComponent } from './barista.component';
import { ApiService } from './services/api.service';
import { SetupCheckGuard } from './setup/setup-check.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { MdButtonModule, MdDialog, MdDialogModule, MdProgressBarModule } from '@angular/material';
import { LoadingInterceptor } from "./http-interceptors/loading.interceptor";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { ConfirmDialogAction } from './barista.actions';
import { Dispatcher } from "../dispatcher/dispatcher";
import { DispatcherModule } from "../dispatcher/dispatcher.module";
import { Event, GuardsCheckEnd, Router } from '@angular/router';
import { Assertion, HierarchicalRoleBaseAccessControl } from '@neoskop/hrbac';
import { HrbacModule, RoleStore } from '@neoskop/hrbac/ng';
import { CookieModule } from 'ngx-cookie';
import { UserService } from './services/user.service';
import { EntityResource } from './pipes/entity-resource.pipe';

@NgModule({
  declarations: [
    BaristaComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BaristaRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MdDialogModule,
    MdButtonModule,
    MdProgressBarModule,
    DispatcherModule.forRoot([]),
    HrbacModule.forRoot({
      roles: {
        "guest": [],
        "_admin": []
      }
    }),
    CookieModule.forRoot()
  ],
  providers: [
    ApiService,
    UserService,
    SetupCheckGuard,
    LoadingInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useExisting: LoadingInterceptor, multi: true }
  ],
  bootstrap: [BaristaComponent],
  entryComponents: [ConfirmComponent]
})
export class BaristaModule {
  constructor(protected api : ApiService,
              protected dispatcher : Dispatcher,
              protected dialog : MdDialog,
              protected hrbac : HierarchicalRoleBaseAccessControl,
              protected roleStore : RoleStore,
              protected router : Router,
              protected userService : UserService) {
    this.dispatcher.for(ConfirmDialogAction).subscribe(action => {
      if(undefined === action.config.position) {
        action.config.position = {
          bottom: '0'
        }
      }
      action.config.data = action;
      const ref = dialog.open(action.component, action.config);
  
      ref.afterClosed().subscribe(action)
    });
    
    router.events.filter<Event, GuardsCheckEnd>((e) : e is GuardsCheckEnd => e instanceof GuardsCheckEnd).subscribe(event => {
      if(!event.shouldActivate) {
        this.router.navigate(event.url.startsWith('/login') ? [ '/' ] : [ '/login' ]);
      }
    });
    
    const user = this.userService.getCurrentUser();
    if(user) {
      this.hrbac.getRoleManager().setParents('user:' + user.id, user.roles);
      this.roleStore.setRole('user:' + user.id);
    }
    
    this.initPermissions();
  }
  
  initPermissions() {
    const rm = this.hrbac.getRoleManager();
    const pm = this.hrbac.getPermissionManager();
    
    rm.setParents('guest', []);
    rm.setParents('user', [ 'guest' ]);
    rm.setParents('manager', [ 'user' ]);
    rm.setParents('admin', [ 'manager' ]);
    rm.setParents('_admin', []);
    
    pm.allow('guest', 'login', 'display');
    pm.deny('user', 'login', 'display');
    
    pm.allow('_admin');
    pm.deny('_admin', 'login', 'display');
    
    pm.allow('user', 'profile');
    
    pm.allow('admin', 'projects');
    pm.allow('admin', 'users', [ 'list', 'create' ]);
    
    pm.allow('admin', 'users', [ 'update', 'remove' ], new Assertion((hrbac : HierarchicalRoleBaseAccessControl, role: any, resource: EntityResource) => {
      if(!(resource instanceof EntityResource)) {
        return false;
      }
      return resource.entity.roles.every(r => hrbac.isAllowed(role, 'role', r));
    }));
    
    pm.allow('admin', 'role');
    pm.deny('admin', 'role', [ '_admin', 'admin' ]);
    
  }
}
