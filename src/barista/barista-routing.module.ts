import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupCheckGuard } from './setup/setup-check.guard';
import { HrbacGuard } from '@neoskop/hrbac/ng';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: './setup/setup.module#SetupModule',
    canActivate: [ SetupCheckGuard ]
  },
  {
    path: 'manage',
    loadChildren: './manage/manage.module#ManageModule',
    canActivate: [ SetupCheckGuard ]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [ SetupCheckGuard, HrbacGuard ],
    data: { resourceId: 'login', privilege: 'display' }
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
