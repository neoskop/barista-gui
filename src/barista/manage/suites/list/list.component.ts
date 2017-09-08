import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, MdSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { CreateSuiteDialogAction, UpdateSuiteDialogAction, RemoveSuiteDialogAction, SearchSuiteAction } from "../suites.actions";
import { ActivatedRoute } from '@angular/router';
import { ReadProjectAction } from '../../projects/projects.actions';
import { BaristaDataSource, ISearchParams } from "../../../datasource";
import { Dispatcher } from "../../../../dispatcher/dispatcher";

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'name', 'actions' ];
  dataSource : BaristaDataSource | null = null;
  
  project : any;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  protected projectId : string;
  protected actionClassFactory = (params : ISearchParams) => {
    return new SearchSuiteAction(this.projectId, params);
  };
  
  constructor(protected route : ActivatedRoute, protected dispatcher : Dispatcher) { }
  
  ngOnInit() {
    this.dataSource = new BaristaDataSource(this.dispatcher, { actionClassFactory: this.actionClassFactory, sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(150).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
    
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('project');
      this.dispatcher.dispatch(new ReadProjectAction(this.projectId)).subscribe(project => {
        this.project = project;
      });
      this.dataSource.reload();
    });
  }
  
  openCreateDialog() {
    this.dispatcher.dispatch(new CreateSuiteDialogAction(this.projectId)).subscribe((result) => {
      console.log('suite create', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateSuiteDialogAction(this.projectId, row)).subscribe((result) => {
      console.log('suite update', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
  
  openRemoveDialog(row : any) {
    this.dispatcher.dispatch(new RemoveSuiteDialogAction(this.projectId, row)).subscribe(result => {
      console.log('suite remove', result);
      if(result) {
        this.dataSource.reload();
      }
    })
  }
}
