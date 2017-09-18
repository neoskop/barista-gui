import { Action } from "../../dispatcher/dispatcher";

export class LoginAction extends Action<void> {
  constructor(public username : string, public password : string) {
    super();
  }
}

export class LogoutAction extends Action<void> {

}
