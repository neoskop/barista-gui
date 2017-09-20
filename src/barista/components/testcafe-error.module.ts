import { NgModule } from '@angular/core';
import { TestcafeErrorComponent } from './testcafe-error/testcafe-error.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TestcafeErrorComponent
  ],
  exports: [
    TestcafeErrorComponent
  ]
})
export class TestcafeErrorModule {

}
