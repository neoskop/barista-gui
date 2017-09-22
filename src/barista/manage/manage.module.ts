import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage/manage.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdListModule, MdSidenavModule, MdToolbarModule, MdIconModule, MdButtonModule, MdMenuModule } from '@angular/material';
import { GravatarModule } from '../../gravatar/gravatar.module';
import { HrbacModule } from '@neoskop/hrbac/ng';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    ManageRoutingModule,
    FlexLayoutModule,
    MdToolbarModule,
    MdSidenavModule,
    MdListModule,
    MdIconModule,
    MdButtonModule,
    GravatarModule,
    HrbacModule.forChild(),
    MdMenuModule,
    ProfileModule
  ],
  declarations: [ManageComponent]
})
export class ManageModule { }
