import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup/setup.component';
import { AdministratorComponent } from './administrator/administrator.component';

const routes : Routes = [
  {
    path     : '',
    component: SetupComponent,
    children : [
      { path: '', component: AdministratorComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SetupRoutingModule {
}
