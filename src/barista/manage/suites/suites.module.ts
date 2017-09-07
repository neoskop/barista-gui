import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuitesRoutingModule } from './suites-routing.module';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule,
  MdChipsModule,
  MdDialog,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdPaginatorModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSortModule,
  MdTableModule,
  MdToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { DispatcherService } from "../../services/dispatcher.service";
import { UpdateComponent } from './update/update.component';
import { CreateSuiteDialogAction, RemoveSuiteDialogAction, UpdateSuiteDialogAction, RemoveSuiteAction, CreateSuiteAction, UpdateSuiteAction } from "./suites.actions";
import { ConfirmAction } from "../../barista.actions";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@NgModule({
  imports: [
    CommonModule,
    SuitesRoutingModule,
    FlexLayoutModule,
    MdToolbarModule,
    MdCardModule,
    MdIconModule,
    MdTableModule,
    MdPaginatorModule,
    MdButtonModule,
    MdInputModule,
    MdDialogModule,
    MdChipsModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSortModule,
    MdAutocompleteModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ListComponent, FormComponent, CreateComponent, UpdateComponent],
  entryComponents: [CreateComponent, UpdateComponent]
})
export class SuitesModule {
  constructor(protected dispatcher : DispatcherService, protected dialog : MdDialog) {
    dispatcher.for(CreateSuiteDialogAction).subscribe(action => {
      const ref = dialog.open(action.component, {
        disableClose: true
      });
      
      ref.afterClosed().subscribe(suite => {
        if(!suite) {
          return action.next(suite);
        }
    
        dispatcher.dispatch(new CreateSuiteAction(action.projectId, suite)).subscribe(action);
      })
    });
    
    dispatcher.for(UpdateSuiteDialogAction).subscribe(action => {
      const ref = dialog.open(action.component, {
        disableClose: true,
        data: action.suite
      });
      
      ref.afterClosed().subscribe(suite => {
        if(!suite) {
          return action.next(suite);
        }
    
        dispatcher.dispatch(new UpdateSuiteAction(action.projectId, suite)).subscribe(action);
      })
    });
    
    dispatcher.effectFor(RemoveSuiteDialogAction, action => {
      const confirmAction = new ConfirmAction(`Delete suite "${action.suite.name}"?`);
    
      confirmAction.mergeMap(confirm => {
        if(confirm) {
          return dispatcher.dispatch(new RemoveSuiteAction(action.projectId, action.suite)).map(() => true);
        } else {
          return Observable.of(false);
        }
      }).subscribe(action);
    
      return confirmAction;
    })
  }
}
