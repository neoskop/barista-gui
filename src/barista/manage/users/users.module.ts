import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdPaginatorModule,
  MdRadioModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdAutocompleteModule,
  MdChipsModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import 'rxjs/add/operator/mergeMap';
import { DispatcherModule } from "../../../dispatcher/dispatcher.module";
import { UsersEffects } from "./users.effects";
import { EntityResourceModule } from "../../pipes/entity-resource.pipe";
import { HrbacModule } from "@neoskop/hrbac/ng";

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
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
    MdDialogModule,
    DispatcherModule.forChild([ UsersEffects ]),
    HrbacModule.forChild(),
    EntityResourceModule,
    MdAutocompleteModule,
    MdChipsModule
  ],
  declarations: [ ListComponent, FormComponent, CreateComponent, UpdateComponent],
  entryComponents: [ CreateComponent, UpdateComponent ]
})
export class UsersModule {}
