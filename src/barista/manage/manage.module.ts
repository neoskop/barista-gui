import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage/manage.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdListModule, MdSidenavModule, MdToolbarModule, MdIconModule, MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ManageRoutingModule,
    FlexLayoutModule,
    MdToolbarModule,
    MdSidenavModule,
    MdListModule,
    MdIconModule,
    MdButtonModule
  ],
  declarations: [ManageComponent]
})
export class ManageModule { }
