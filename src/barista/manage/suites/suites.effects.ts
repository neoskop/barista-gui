import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Dispatcher } from '../../../dispatcher/dispatcher';
import { EffectFor } from '../../../dispatcher/metadata';
import { CreateSuiteAction, CreateSuiteDialogAction, UpdateSuiteDialogAction, UpdateSuiteAction, RemoveSuiteDialogAction, RemoveSuiteAction } from "./suites.actions";
import { Observable } from "rxjs/Observable";
import { ConfirmDialogAction } from '../../barista.actions';

@Injectable()
export class SuitesEffects {
  
  constructor(protected dialog : MdDialog, protected dispatcher : Dispatcher) {
  }
  
  
  @EffectFor(CreateSuiteDialogAction)
  createSuiteDialog(o : Observable<CreateSuiteDialogAction>) {
    return o.mergeMap(action => {
      const ref = this.dialog.open(action.component, {
        disableClose: true
      });
      
      return ref.afterClosed().map(result => {
        if(result) {
          const createAction = new CreateSuiteAction(action.projectId, result);
          createAction.subscribe(action);
          
          return createAction;
        } else {
          action.next(result);
        }
      });
    });
  }
  
  @EffectFor(UpdateSuiteDialogAction)
  updateSuiteDialog(o : Observable<UpdateSuiteDialogAction>) {
    return o.mergeMap(action => {
      const ref = this.dialog.open(action.component, {
        disableClose: true,
        data: action.suite
      });
      
      return ref.afterClosed().map(result => {
        if(result) {
          const updateAction = new UpdateSuiteAction(action.projectId, result);
          updateAction.subscribe(action);
          
          return updateAction;
        } else {
          action.next(result);
        }
      });
    });
  }
  
  @EffectFor(RemoveSuiteDialogAction)
  removeSuiteDialog(o : Observable<RemoveSuiteDialogAction>) {
    return o.map(action => {
      const confirmAction = new ConfirmDialogAction(`Delete suite "${action.suite.name}"?`);
      
      confirmAction.mergeMap(confirm => {
        if(confirm) {
          return this.dispatcher.dispatch(new RemoveSuiteAction(action.projectId, action.suite)).map(() => true);
        } else {
          return Observable.of(false);
        }
      }).subscribe(action);
      
      return confirmAction;
    })
  }
}
