import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { AdministratorComponent } from './administrator/administrator.component';
import { SetupComponent } from './setup/setup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdButtonModule, MdCardModule, MdInputModule, MdToolbarModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SetupRoutingModule,
    FlexLayoutModule,
    MdCardModule,
    MdButtonModule,
    MdToolbarModule,
    MdInputModule,
    ReactiveFormsModule
  ],
  declarations: [AdministratorComponent, SetupComponent]
})
export class SetupModule { }
