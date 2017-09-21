import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
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
  MdToolbarModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { CreateComponent } from './create/create.component';
import { RadioTabsDirective, RadioTabValueDirective } from "../../directives/radio-tabs.directive";
import { UpdateComponent } from './update/update.component';
import 'rxjs/add/operator/mergeMap';
import { DispatcherModule } from "../../../dispatcher/dispatcher.module";
import { ProjectsEffects } from "./projects.effects";
import { EntityResourcePipe } from "../../pipes/entity-resource.pipe";
import { HrbacModule } from "@neoskop/hrbac/ng";

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
    MdDialogModule,
    DispatcherModule.forChild([ ProjectsEffects ]),
    HrbacModule.forChild()
  ],
  declarations: [RadioTabsDirective, EntityResourcePipe, RadioTabValueDirective, ListComponent, FormComponent, CreateComponent, UpdateComponent],
  entryComponents: [ CreateComponent, UpdateComponent ]
})
export class ProjectsModule {}
