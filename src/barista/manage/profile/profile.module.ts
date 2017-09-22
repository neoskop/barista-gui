import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DispatcherModule } from '../../../dispatcher/dispatcher.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdDialogModule, MdInputModule } from '@angular/material';
import { ProfileEffects } from './profile.effects';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdInputModule,
    MdButtonModule,
    MdDialogModule,
    DispatcherModule.forChild([ ProfileEffects ])
  ],
  declarations: [ChangePasswordComponent],
  entryComponents: [ChangePasswordComponent]
})
export class ProfileModule { }
