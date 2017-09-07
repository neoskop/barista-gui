import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

type Ctor<T> = { new(...args : any[]): T };

export class Action<T> extends Subject<T> {

}

@Injectable()
export class DispatcherService {
  protected root = new Subject<any>();
  protected out = this.root.map(action => {
    if(this.effects.has(action.constructor)) {
      return this.effects.get(action.constructor)(action) || action;
    }
    
    return action;
  });
  
  protected effects = new WeakMap<Ctor<any>, Function>();
  
  constructor() {
  
  }
  
  dispatch<T>(value : T) : T {
    setTimeout(() => {
      this.root.next(value);
    });
    return value;
  }
  
  for<T>(cls : Ctor<T>) : Observable<T> {
    return this.out.filter(value => value instanceof cls);
  }
  
  effectFor<T, U>(cls : Ctor<T>, effect : (action : T) => U|void) : void {
    this.effects.set(cls, effect);
  }

}
