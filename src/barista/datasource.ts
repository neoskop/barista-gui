import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdPaginator, MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Action, DispatcherService } from './services/dispatcher.service';

export interface ISearchParams {
  filter?: string;
  sort?: string;
  order?: string;
  offset?: number;
  limit?: number;
}

export interface ISearchAction extends Action<any[]> {
  params: ISearchParams;
}

export interface ISearchActionContructor {
  new(...args : any[]) : ISearchAction;
}

@Injectable()
export class BaristaDataSource extends DataSource<any> {
  protected _filterSubject = new BehaviorSubject('');
  get filter() { return this._filterSubject.value }
  set filter(filter : string) { this._filterSubject.next(filter) }
  
  protected _lengthSubject = new BehaviorSubject(0);
  get length() { return this._lengthSubject.value }
  set length(length : number) { this._lengthSubject.next(length) }
  
  protected _reloadTrigger = new Subject<void>();
  
  protected sort : MdSort | null = null;
  protected paginator : MdPaginator | null = null;
  
  protected actionClass : ISearchActionContructor;
  protected actionClassFactory : (params : ISearchParams) => ISearchAction = params => new this.actionClass(params);
  
  constructor(protected dispatcher : DispatcherService, {
    actionClass,
    actionClassFactory,
    sort,
    paginator } : {
    actionClass? : ISearchActionContructor,
    actionClassFactory?: (params : ISearchParams) => ISearchAction,
    sort? : MdSort,
    paginator? : MdPaginator } = {}) {
    super();
    
    if(sort) {
      this.sort = sort;
    }
    if(paginator) {
      this.paginator = paginator;
    }
    if(actionClass) {
      this.actionClass = actionClass;
    }
    if(actionClassFactory) {
      this.actionClassFactory = actionClassFactory;
    }
  }
  
  reload() {
    this._reloadTrigger.next();
  }
  
  connect() : Observable<any[]> {
    const changes : Subject<any>[] = [
      this._reloadTrigger,
      this._filterSubject,
    ];
    
    if(this.sort) {
      changes.push(this.sort.mdSortChange);
    }
    if(this.paginator) {
      changes.push(this.paginator.page);
    }
    
    const out = new Subject<any>();
    
    Observable.merge(...changes).debounceTime(15).subscribe(() => {
      this.dispatcher.dispatch<any>(this.actionClassFactory({
        filter: this.filter,
        sort: this.sort.active,
        order: this.sort.direction,
        offset: this.paginator.pageIndex * this.paginator.pageSize,
        limit: this.paginator.pageSize
      })).subscribe(result => {
        out.next(result.rows);
        this.length = result.total;
      });
    });
    
    return out;
  }
  
  disconnect() : void {
  }
}
