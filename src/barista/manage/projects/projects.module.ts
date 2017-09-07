import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ListComponent } from './list/list.component';
import {
  MdInputModule, MdSortModule, MdTableModule, MdToolbarModule, MdPaginatorModule, MdIconModule, MdButtonModule, MdRadioModule,
  MdTabsModule,
  MdCardModule,
  MdDialogModule, MdDialog
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { DispatcherService } from "../../services/dispatcher.service";
import { RadioTabsDirective, RadioTabValueDirective } from "../../directives/radio-tabs.directive";
import { UpdateComponent } from './update/update.component';
import {
  CreateProjectDialogAction, RemoveProjectDialogAction, UpdateProjectDialogAction, CreateProjectAction, UpdateProjectAction,
  RemoveProjectAction
} from './projects.actions';
import { ConfirmAction } from "../../barista.actions";
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';

@NgModule({
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    FlexLayoutModule,
    MdToolbarModule,
    MdSortModule,
    MdTableModule,
    MdInputModule,
    MdPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MdIconModule,
    MdButtonModule,
    MdRadioModule,
    MdTabsModule,
    MdCardModule,
    MdDialogModule
  ],
  declarations: [RadioTabsDirective, RadioTabValueDirective, ListComponent, FormComponent, CreateComponent, UpdateComponent],
  entryComponents: [ CreateComponent, UpdateComponent ]
})
export class ProjectsModule {
  
  constructor(protected dispatcher : DispatcherService, protected dialog : MdDialog) {
    dispatcher.for(CreateProjectDialogAction).subscribe(action => {
      const ref = dialog.open(action.component, {
        disableClose: true
      });
      
      ref.afterClosed().subscribe(project => {
        if(!project) {
          return action.next(project);
        }
        
        dispatcher.dispatch(new CreateProjectAction(project)).subscribe(action);
      })
    });
    
    dispatcher.for(UpdateProjectDialogAction).subscribe(action => {
      const ref = dialog.open(action.component, {
        disableClose: true,
        data: action.project
      });
  
      ref.afterClosed().subscribe(project => {
        if(!project) {
          return action.next(project);
        }
  
        dispatcher.dispatch(new UpdateProjectAction(project)).subscribe(action);
      })
    });
    
    dispatcher.effectFor(RemoveProjectDialogAction, action => {
      const confirmAction = new ConfirmAction(`Delete project "${action.project.name}"?`);
      
      confirmAction.mergeMap(confirm => {
        if(confirm) {
          return dispatcher.dispatch(new RemoveProjectAction(action.project)).map(() => true);
        } else {
          return Observable.of(false);
        }
      }).subscribe(action);
      
      return confirmAction;
    })
  }
}
