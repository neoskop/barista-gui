import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  
  protected loading = 0;
  
  get isLoading() {
    return 0 < this.loading;
  }
  
  
  intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
    this.loading++;
    
    return next.handle(req).do(null, () => --this.loading, () => --this.loading);
  }
}
