import { Action } from '../services/dispatcher.service';

export class SetupAdministratorAction extends Action<void> {
  constructor(public username : string, public email : string, public password : string) {
    super()
  }
}

export class SetupCheckAction extends Action<boolean> {
  constructor(public isSetup : boolean) {
    super();
  }
}
