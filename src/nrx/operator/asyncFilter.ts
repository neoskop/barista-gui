import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Operator } from 'rxjs/Operator';
import { TeardownLogic } from 'rxjs/Subscription';

export function asyncFilter<T>(this : Observable<T>, predicate: (value : T, index : number) => Promise<boolean>, thisArg?: any) {
  return this.lift(new AsyncFilterOperator(predicate, thisArg))
}

export class AsyncFilterOperator<T> implements Operator<T, T> {
  constructor(private predicate: (value: T, index: number) => Promise<boolean>,
              private thisArg?: any) {
  }
  
  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new AsyncFilterSubscriber(subscriber, this.predicate, this.thisArg));
  }
}

export class AsyncFilterSubscriber<T> extends Subscriber<T> {
  protected count = 0;
  protected pending = 0;
  protected shouldComplete = false;
  
  constructor(destination: Subscriber<T>,
              private predicate: (value: T, index: number) => Promise<boolean>,
              private thisArg: any) {
    super(destination);
  }
  
  protected async _next(value: T) {
    try {
      ++this.pending;
      const result = await this.predicate.call(this.thisArg, value, this.count++);
      if(result) {
        this.destination.next(value);
      }
    } catch (err) {
      this.destination.error(err);
    } finally {
      --this.pending;
      if(0 === this.pending && this.shouldComplete) {
        this.destination.complete();
      }
    }
  }
  
  protected _complete() {
    this.shouldComplete = true;
  }
}
