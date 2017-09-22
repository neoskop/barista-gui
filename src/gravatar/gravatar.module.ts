import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GravatarDirective } from './gravatar.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GravatarDirective],
  exports: [GravatarDirective]
})
export class GravatarModule { }
