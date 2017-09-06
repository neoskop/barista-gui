import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupCheckGuard } from './setup/setup-check.guard';
import { AuthGuard } from './login/auth.guard';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: './setup/setup.module#SetupModule',
    canActivate: [ SetupCheckGuard ]
  },
  {
    path: 'manage',
    loadChildren: './manage/manage.module#ManageModule',
    canActivate: [ SetupCheckGuard, AuthGuard ]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [ SetupCheckGuard, AuthGuard ]
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
