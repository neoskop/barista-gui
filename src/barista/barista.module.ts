import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { BaristaRoutingModule } from './barista-routing.module';
import { BaristaComponent } from './barista.component';
import { DispatcherService } from "./services/dispatcher.service";
import { ApiService } from './services/api.service';
import { SetupCheckGuard } from './setup/setup-check.guard';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from './http-interceptors/auth.interceptor';
import { AuthGuard } from './login/auth.guard';

@NgModule({
  declarations: [
    BaristaComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BaristaRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    DispatcherService,
    ApiService,
    SetupCheckGuard,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [BaristaComponent]
})
export class BaristaModule {
  constructor(protected api : ApiService) {}
}
