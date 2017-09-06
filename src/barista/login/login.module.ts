import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MdCardModule, MdToolbarModule, MdInputModule, MdButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MdCardModule,
    MdToolbarModule,
    MdInputModule,
    MdButtonModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
