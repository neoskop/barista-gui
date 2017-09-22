import { Action } from '../../../dispatcher/dispatcher';

export class UpdatePasswordDialogAction extends Action<void> {

}

export class UpdatePasswordAction extends Action<void> {
  constructor(public current : string, public updated : string) {
    super()
  }
}
