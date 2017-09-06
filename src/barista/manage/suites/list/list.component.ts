import { Component, OnInit, ViewChild } from '@angular/core';
import { MdPaginator, MdSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { DispatcherService } from '../../../services/dispatcher.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { CreateSuiteDialogAction } from "../create/create.component";
import { UpdateSuiteDialogAction } from '../update/update.component';

@Component({
  selector: 'barista-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  displayColumns = [ 'id', 'name', 'actions' ];
  dataSource : SuitesDataSource | null = null;
  
  @ViewChild(MdSort) sort : MdSort;
  @ViewChild(MdPaginator) paginator : MdPaginator;
  
  filter = new FormControl();
  
  constructor(protected dispatcher : DispatcherService) { }
  
  ngOnInit() {
    this.dataSource = new SuitesDataSource({ sort: this.sort, paginator: this.paginator });
    this.filter.valueChanges.debounceTime(150).distinctUntilChanged().subscribe(value => this.dataSource.filter = value);
  }
  
  openCreateDialog() {
    this.dispatcher.dispatch(new CreateSuiteDialogAction()).subscribe((result) => {
      console.log('suite create', result);
    })
  }
  
  openUpdateDialog(row : any) {
    this.dispatcher.dispatch(new UpdateSuiteDialogAction(row)).subscribe((result) => {
      console.log('suite update', result);
    })
  }
}

const DATA = [
  {
    "id"      : "de",
    "name"    : "Deutschland",
    "glob"    : [
      "e2e/de/**/*.spec.ts"
    ],
    "browsers": [
      "chrome",
      "firefox"
    ],
    "options" : {
      "skipJsErrors"    : true,
      "quarantineMode"  : true,
      "selectorTimeout" : 10000,
      "assertionTimeout": 3000,
      "speed"           : 0.75
    }
  },
  {
    "id"      : "be",
    "name"    : "Belgien",
    "glob"    : [
      "e2e/be/**/*.spec.ts"
    ],
    "browsers": [
      "chrome"
    ]
  }
];

export class SuitesDataSource extends DataSource<any> {
  protected _filterSubject = new BehaviorSubject('');
  get filter() { return this._filterSubject.value }
  set filter(filter : string) { this._filterSubject.next(filter) }
  
  protected sort : MdSort | null = null;
  protected paginator : MdPaginator | null = null;
  
  
  constructor({ sort, paginator } : { sort? : MdSort, paginator? : MdPaginator } = {}) {
    super();
    
    if(sort) {
      this.sort = sort;
    }
    if(paginator) {
      this.paginator = paginator;
    }
  }
  
  connect(collectionViewer : CollectionViewer) : Observable<any[]> {
    const changes : Subject<any>[] = [
      this._filterSubject,
    ];
    
    if(this.sort) {
      changes.push(this.sort.mdSortChange);
    }
    if(this.paginator) {
      changes.push(this.paginator.page);
    }
    
    return Observable.merge(...changes).debounceTime(50).map(() => {
      const filter = this.filter.toLowerCase();
      const data = filter ? DATA.filter(row => {
        return row.name.toLowerCase().includes(filter)
          || row.id.toLowerCase().includes(filter);
      }) : DATA.slice();
      
      
      if(this.sort) {
        const { active, direction } = this.sort;
        
        if(active) {
          data.sort((a, b) => {
            let aV : string, bV : string;
            
            switch(active) {
              case 'id':
                [ aV, bV ] = [ a.id, b.id ];
                break;
              case 'name':
                [ aV, bV ] = [ a.name, b.name ];
                break;
            }
            
            return aV.localeCompare(bV) * ('desc' === direction ? -1 : 1);
          })
        }
      }
      
      if(this.paginator) {
        const start = this.paginator.pageIndex * this.paginator.pageSize;
        const end = this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize;
        return data.slice(start, end);
      }
      return data;
    })
  }
  
  disconnect(collectionViewer : CollectionViewer) : void {
  }
}
