import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UpdatePasswordDialogAction } from './profile.actions';
import { EffectFor } from '../../../dispatcher/metadata';
import { MdDialog } from '@angular/material';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Injectable()
export class ProfileEffects {

  constructor(protected dialog : MdDialog) {
  
  }
  
  @EffectFor(UpdatePasswordDialogAction)
  updatePasswordDialog(o : Observable<UpdatePasswordDialogAction>) {
    return o.mergeMap(action => {
      const ref = this.dialog.open(ChangePasswordComponent, {
        position: {
          right: '0',
          top: '64px'
        }
      });
      
      return ref.afterClosed().map(() => {
        action.next();
      });
    })
  }
}
