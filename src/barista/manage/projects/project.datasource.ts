import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdPaginator, MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ProjectsDataSource extends DataSource<any> {
  protected _filterSubject = new BehaviorSubject('');
  get filter() { return this._filterSubject.value }
  set filter(filter : string) { this._filterSubject.next(filter) }
  
  protected _lengthSubject = new BehaviorSubject(0);
  get length() { return this._lengthSubject.value }
  set length(length : number) { this._lengthSubject.next(length) }
  
  protected _reloadTrigger = new Subject<void>();
  
  protected sort : MdSort | null = null;
  protected paginator : MdPaginator | null = null;
  
  
  constructor(protected http : HttpClient, { sort, paginator } : { sort? : MdSort, paginator? : MdPaginator } = {}) {
    super();
    
    if(sort) {
      this.sort = sort;
    }
    if(paginator) {
      this.paginator = paginator;
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
      let params = new HttpParams();
      params = params.set('filter', this.filter);
      params = params.set('sort', this.sort.active);
      params = params.set('order', this.sort.direction);
      params = params.set('offset', (this.paginator.pageIndex * this.paginator.pageSize).toString());
      params = params.set('limit', this.paginator.pageSize.toString());
      
      this.http.get('/_api/projects', {
        params
      }).subscribe((result : any) => {
        out.next(result.result.rows);
        this.length = result.result.total;
      })
    });
    
    return out;
  }
  
  disconnect() : void {
  }
}
