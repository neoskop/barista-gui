import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/observeOn';
import { async } from 'rxjs/scheduler/async';
import { Subscription } from "rxjs/Subscription";
import { Operator } from "rxjs/Operator";

type Ctor<T> = { new(...args : any[]): T };

export class Action<T> extends Subject<T> {

}

@Injectable()
export class Dispatcher extends Subject<any> {
  protected root = new Subject<any>();
  protected observable : Observable<any> = this.root.observeOn(async);
  protected subscription : Subscription;
  
  constructor() {
    super();
  }
  
  dispatch<T>(value : T) : T {
    this.root.next(value);
    return value;
  }
  
  start() {
    if(!this.subscription) {
      this.subscription = this.observable.subscribe(this);
    }
  }
  
  lift<R>(operator: Operator<any, R>): Observable<R> {
    const observable = new Dispatcher();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }
  
  for<T>(cls : Ctor<T>) : Observable<T> {
    return this.filter(value => value instanceof cls);
  }
  
  effectFor<T, U>(cls : Ctor<T>, effect : (action : T) => U|void) : void {
    this.effect<T, U>(a => cls === a.constructor, o => o.map(a => effect(a) || a))
  }
  
  effect<T, U>(filter : (action : T) => boolean, transform : (observable : Observable<T>) => Observable<U>) {
    const started = !!this.subscription;
    if(started) {
      this.subscription.unsubscribe();
    }

    let [ filtered, rest ] = this.observable.partition(filter);
    
    transform(filtered).subscribe(this);
    
    this.observable = rest;
    
    if(started) {
      this.subscription = this.observable.subscribe(this);
    }
  }
}
