import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injectable, NgModule } from '@angular/core';

import { BaristaRoutingModule } from './barista-routing.module';
import { BaristaComponent } from './barista.component';
import { ApiService } from './services/api.service';
import { SetupCheckGuard } from './setup/setup-check.guard';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { AuthGuard } from './login/auth.guard';
import { MdProgressBarModule, MdDialog, MdDialogModule, MdButtonModule } from '@angular/material';
import { LoadingInterceptor } from "./http-interceptors/loading.interceptor";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { ConfirmDialogAction } from './barista.actions';
import { Dispatcher } from "../dispatcher/dispatcher";
import { DispatcherModule, RootDispatcherModule } from "../dispatcher/dispatcher.module";


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
    DispatcherModule.forRoot([])
  ],
  providers: [
    ApiService,
    SetupCheckGuard,
    AuthGuard,
    LoadingInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useExisting: LoadingInterceptor, multi: true }
  ],
  bootstrap: [BaristaComponent],
  entryComponents: [ConfirmComponent]
})
export class BaristaModule {
  constructor(protected api : ApiService, protected dispatcher : Dispatcher, protected dialog : MdDialog) {
    this.dispatcher.for(ConfirmDialogAction).subscribe(action => {
      if(undefined === action.config.position) {
        action.config.position = {
          bottom: '0'
        }
      }
      action.config.data = action;
      const ref = dialog.open(action.component, action.config);
  
      ref.afterClosed().subscribe(action)
    })
    
  }
}
