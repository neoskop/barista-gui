import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';

const routes : Routes = [
  {
    path     : '',
    component: ManageComponent,
    children : [
      {
        path: 'projects',
        loadChildren: './projects/projects.module#ProjectsModule'
      },
      {
        path: 'suites',
        loadChildren: './suites/suites.module#SuitesModule'
      },
      {
        path: '**',
        redirectTo: 'projects'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
