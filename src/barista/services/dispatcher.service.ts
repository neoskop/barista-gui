import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

type Ctor<T> = { new(...args : any[]): T };

export class Action<T> extends Subject<T> {

}

@Injectable()
export class DispatcherService extends Subject<any> {

  constructor() {
    super()
  }
  
  dispatch<T>(action : Action<T>) : Action<T>
  dispatch<T>(value : T) : T {
    setTimeout(() => {
      this.next(value);
    });
    return value;
  }
  
  for<T>(cls : Ctor<T>) : Observable<T> {
    return this.filter(value => value instanceof cls);
  }

}
