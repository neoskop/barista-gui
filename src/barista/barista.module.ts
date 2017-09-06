import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { BaristaRoutingModule } from './barista-routing.module';
import { BaristaComponent } from './barista.component';
import { DispatcherService } from "./services/dispatcher.service";

@NgModule({
  declarations: [
    BaristaComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BaristaRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    DispatcherService
  ],
  bootstrap: [BaristaComponent]
})
export class BaristaModule { }
