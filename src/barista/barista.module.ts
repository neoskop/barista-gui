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
import * as jwt from 'jwt-decode'
import { Event, GuardsCheckEnd, Router } from '@angular/router';
import { HierarchicalRoleBaseAccessControl } from '@neoskop/hrbac';
import { HrbacModule, RoleStore } from '@neoskop/hrbac/lib.es6/ng';


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
      },
      permissions: [
        [ 'guest' , [ [ 'login', [ { type: 'allow', privileges: [ 'display' ] } ] ] ] ],
        [ '_admin' , [ [ null, [ { type: 'allow', privileges: null } ] ] ] ],
        [ '_admin' , [ [ 'login', [ { type: 'deny', privileges: [ 'display' ] } ] ] ] ]
      ]
    })
  ],
  providers: [
    ApiService,
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
              protected router : Router) {
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
    
    if(localStorage.getItem('Authorization')) {
      const token = jwt<{ aud: string, rol: string[] }>(localStorage.getItem('Authorization'));
      
      this.hrbac.getRoleManager().setParents(token.aud, token.rol);
      this.roleStore.setRole(token.aud);
      
    }
  }
}
