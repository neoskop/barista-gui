import { Injectable } from '@angular/core';
import { EffectFor } from '../../../dispatcher/metadata';
import {
  CreateUserDialogAction, RemoveUserDialogAction, RemoveUserAction, CreateUserAction,
  UpdateUserDialogAction, UpdateUserAction, ReadUserAction
} from './users.actions';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { ConfirmDialogAction } from '../../barista.actions';
import { Dispatcher } from "../../../dispatcher/dispatcher";
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';

@Injectable()
export class UsersEffects {
  
  constructor(protected dialog : MdDialog, protected dispatcher : Dispatcher) {}
  
  @EffectFor(CreateUserDialogAction)
  createUserDialog(o : Observable<CreateUserDialogAction>) {
    return o.mergeMap(action => {
      const ref = this.dialog.open(CreateComponent, {
        disableClose: true
      });
      
      return ref.afterClosed().map(result => {
        if(result) {
          const createAction = new CreateUserAction(result);
          createAction.subscribe(action);
    
          return createAction;
        } else {
          action.next(result);
        }
      });
    });
  }
  
  @EffectFor(UpdateUserDialogAction)
  updateUserDialog(o : Observable<UpdateUserDialogAction>) {
    return o.mergeMap(action => {
      return this.dispatcher.dispatch(new ReadUserAction(action.project._id, 'all')).mergeMap(project => {
        const ref = this.dialog.open(UpdateComponent, {
          disableClose: true,
          data        : project
        });
  
        return ref.afterClosed().map(result => {
          if(result) {
            const updateAction = new UpdateUserAction(result);
            updateAction.subscribe(action);
      
            return updateAction;
          } else {
            action.next(result);
          }
        });
      });
    });
  }
  
  @EffectFor(RemoveUserDialogAction)
  removeUserDialog(o : Observable<RemoveUserDialogAction>) {
    return o.map(action => {
      const confirmAction = new ConfirmDialogAction(`Delete user "${action.user._id}"?`);

      confirmAction.mergeMap(confirm => {
        if(confirm) {
          return this.dispatcher.dispatch(new RemoveUserAction(action.user)).map(() => true);
        } else {
          return Observable.of(false);
        }
      }).subscribe(action);

      return confirmAction;
    })
  }
}
