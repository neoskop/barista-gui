import { Injectable } from '@angular/core';
import { EffectFor } from '../../../dispatcher/metadata';
import {
  CreateProjectDialogAction, RemoveProjectDialogAction, RemoveProjectAction, CreateProjectAction,
  UpdateProjectDialogAction, UpdateProjectAction, ReadProjectAction
} from './projects.actions';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { ConfirmDialogAction } from '../../barista.actions';
import { Dispatcher } from "../../../dispatcher/dispatcher";

@Injectable()
export class ProjectsEffects {
  
  constructor(protected dialog : MdDialog, protected dispatcher : Dispatcher) {}
  
  @EffectFor(CreateProjectDialogAction)
  createProjectDialog(o : Observable<CreateProjectDialogAction>) {
    return o.mergeMap(action => {
      const ref = this.dialog.open(action.component, {
        disableClose: true
      });
      
      return ref.afterClosed().map(result => {
        if(result) {
          const createAction = new CreateProjectAction(result);
          createAction.subscribe(action);
    
          return createAction;
        } else {
          action.next(result);
        }
      });
    });
  }
  
  @EffectFor(UpdateProjectDialogAction)
  updateProjectDialog(o : Observable<UpdateProjectDialogAction>) {
    return o.mergeMap(action => {
      return this.dispatcher.dispatch(new ReadProjectAction(action.project._id, 'all')).mergeMap(project => {
        const ref = this.dialog.open(action.component, {
          disableClose: true,
          data        : project
        });
  
        return ref.afterClosed().map(result => {
          if(result) {
            const updateAction = new UpdateProjectAction(result);
            updateAction.subscribe(action);
      
            return updateAction;
          } else {
            action.next(result);
          }
        });
      });
    });
  }
  
  @EffectFor(RemoveProjectDialogAction)
  removeProjectDialog(o : Observable<RemoveProjectDialogAction>) {
    return o.map(action => {
      const confirmAction = new ConfirmDialogAction(`Delete project "${action.project.name}"?`);

      confirmAction.mergeMap(confirm => {
        if(confirm) {
          return this.dispatcher.dispatch(new RemoveProjectAction(action.project)).map(() => true);
        } else {
          return Observable.of(false);
        }
      }).subscribe(action);

      return confirmAction;
    })
  }
}
