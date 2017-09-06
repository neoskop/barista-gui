import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: './setup/setup.module#SetupModule'
  },
  {
    path: 'manage',
    loadChildren: './manage/manage.module#ManageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'manage'
  },
  {
    path: '**',
    redirectTo: 'manage'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class BaristaRoutingModule { }
