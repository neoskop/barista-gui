import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'encodeUri' })
export class EncodeUriPipe implements PipeTransform {
  
  transform(value : string) : any {
    if(null == value) {
      return '';
    }
    return encodeURI(value);
  }
}

@Pipe({ name: 'encodeUriComponent' })
export class EncodeUriComponentPipe implements PipeTransform {
  
  transform(value : string) : any {
    if(null == value) {
      return '';
    }
    return encodeURIComponent(value);
  }
}
