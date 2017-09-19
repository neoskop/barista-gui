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
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdPaginatorModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSortModule,
  MdTableModule, MdTabsModule,
  MdToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DispatcherModule } from '../../../dispatcher/dispatcher.module';
import { SuitesEffects } from './suites.effects';
import { DetailsComponent } from './details/details.component';

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
    MdTabsModule,
    ReactiveFormsModule,
    FormsModule,
    DispatcherModule.forChild([ SuitesEffects ])
  ],
  declarations: [ListComponent, FormComponent, CreateComponent, UpdateComponent, DetailsComponent],
  entryComponents: [CreateComponent, UpdateComponent]
})
export class SuitesModule {}
