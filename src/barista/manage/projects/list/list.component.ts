import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import { MdPaginator, MdSort } from '@angular/material';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DispatcherService } from "../../../services/dispatcher.service";
import { CreateProjectDialogAction, RemoveProjectDialogAction, SearchProjectAction, UpdateProjectDialogAction } from '../projects.actions';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { BaristaDataSource } from '../../../datasource';

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'name', 'repository.url', 'repository.branch', 'actions' ];
  dataSource : BaristaDataSource | null = null;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  constructor(protected http : HttpClient, protected dispatcher : DispatcherService, protected router : Router) { }

  ngOnInit() {
    this.dataSource = new BaristaDataSource(this.dispatcher, { actionClass: SearchProjectAction, sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(250).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
  }

  openCreateDialog() {
    this.dispatcher.dispatch(new CreateProjectDialogAction()).subscribe((result) => {
      console.log('project create', result);
      
      if(result) {
        this.router.navigate([ '/manage', 'projects', result._id ]);
      }
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateProjectDialogAction(row)).subscribe((result) => {
      console.log('project update', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
  
  openRemoveDialog(row : any) {
    this.dispatcher.dispatch(new RemoveProjectDialogAction(row)).subscribe(result => {
      console.log('project remove', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
}
