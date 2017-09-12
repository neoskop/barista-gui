import { Component } from '@angular/core';
import { LoadingInterceptor } from './http-interceptors/loading.interceptor';

@Component({
  selector: 'barista-root',
  templateUrl: './barista.component.html',
  styleUrls: ['./barista.component.sass']
})
export class BaristaComponent {
  
  constructor(public loadingInterceptor : LoadingInterceptor) {
  
  }
}
