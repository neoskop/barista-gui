import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/merge';
import { MdPaginator, MdSort } from '@angular/material';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CreateUserDialogAction, RemoveUserDialogAction, SearchUserAction, UpdateUserDialogAction } from '../users.actions';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { BaristaDataSource } from '../../../datasource';
import { Dispatcher } from "../../../../dispatcher/dispatcher";

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'email', 'roles', 'actions' ];
  dataSource : BaristaDataSource | null = null;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  constructor(protected http : HttpClient, protected dispatcher : Dispatcher, protected router : Router) { }

  ngOnInit() {
    this.dataSource = new BaristaDataSource(this.dispatcher, { actionClass: SearchUserAction, sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(250).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
  }

  openCreateDialog() {
    this.dispatcher.dispatch(new CreateUserDialogAction()).subscribe((result) => {
      console.log('user create', result);
      
      if(result) {
        this.filter.setValue(result._id);
      }
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateUserDialogAction(row)).subscribe((result) => {
      console.log('user update', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
  
  openRemoveDialog(row : any) {
    this.dispatcher.dispatch(new RemoveUserDialogAction(row)).subscribe(result => {
      console.log('user remove', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
}
