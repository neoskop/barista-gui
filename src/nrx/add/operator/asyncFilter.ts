import { asyncFilter } from "../../operator/asyncFilter";
import { Observable } from 'rxjs/Observable';

declare module 'rxjs/Observable' {
  interface Observable<T> {
    asyncFilter: typeof asyncFilter;
  }
}

Observable.prototype.asyncFilter = asyncFilter;
