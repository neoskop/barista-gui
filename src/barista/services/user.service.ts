import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import * as jwt from 'jwt-decode'

export interface IUser {
  id: string;
  email: string;
  roles: string[];
}

@Injectable()
export class UserService {
  constructor(protected cookies : CookieService) {
  
  }
  
  getCurrentUser() : IUser|null {
    if(this.cookies.get('jwt')) {
      const token = jwt<{ aud: string, email: string, rol: string[] }>(this.cookies.get('jwt'));
    
      return {
        id: token.aud,
        email: token.email,
        roles: token.rol
      }
    }
    return null;
  }
  
  removeCurrentUser() {
    this.cookies.remove('jwt');
  }
}
