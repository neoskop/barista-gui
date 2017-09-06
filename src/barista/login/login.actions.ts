import { Action } from '../services/dispatcher.service';

export class LoginAction extends Action<void> {
  constructor(public username : string, public password : string) {
    super();
  }
}

export class LogoutAction extends Action<void> {

}

export class AuthCheckAction extends Action<boolean> {
  constructor(public isLogin : boolean) {
    super();
  }
}
