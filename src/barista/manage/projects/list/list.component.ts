import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import { MdPaginator, MdSort } from '@angular/material';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DispatcherService } from "../../../services/dispatcher.service";
import { CreateProjectDialogAction, UpdateProjectDialogAction } from '../projects.actions';
import { HttpClient } from "@angular/common/http";
import { ProjectsDataSource } from "../project.datasource";

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'name', 'repository.url', 'repository.branch', 'actions' ];
  dataSource : ProjectsDataSource | null = null;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  constructor(protected http : HttpClient, protected dispatcher : DispatcherService) { }

  ngOnInit() {
    this.dataSource = new ProjectsDataSource(this.http, { sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(250).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
  }

  openCreateDialog() {
    this.dispatcher.dispatch(new CreateProjectDialogAction()).subscribe((result) => {
      console.log('project create', result);
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateProjectDialogAction(row)).subscribe((result) => {
      console.log('project update', result);
    })
  }
}
