import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { HrbacGuard } from '@neoskop/hrbac/lib.es6/ng';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListComponent
  },
  {
    path: ':project',
    loadChildren: '../suites/suites.module#SuitesModule',
    canActivate: [ HrbacGuard ],
    data: { resourceId: 'suites', privilege: 'list' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
