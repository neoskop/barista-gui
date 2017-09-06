import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuitesRoutingModule } from './suites-routing.module';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MdCardModule, MdToolbarModule, MdIconModule, MdTableModule, MdPaginatorModule, MdButtonModule, MdInputModule,
  MdDialog, MdDialogModule, MdChipsModule, MdAutocompleteModule, MdSlideToggleModule, MdSliderModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { DispatcherService } from "../../services/dispatcher.service";
import { UpdateComponent } from './update/update.component';
import { CreateSuiteDialogAction, UpdateSuiteDialogAction } from "./suites.actions";

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
      
      ref.afterClosed().subscribe(action)
    });
    
    dispatcher.for(UpdateSuiteDialogAction).subscribe(action => {
      const ref = dialog.open(action.component, {
        disableClose: true,
        data: action.suite
      });

      ref.afterClosed().subscribe(action)
    })
  }
}
