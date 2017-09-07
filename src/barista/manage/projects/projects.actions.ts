import { Action } from '../../services/dispatcher.service';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';

export class CreateProjectDialogAction extends Action<void|any> {
  readonly component = CreateComponent;
}


export class UpdateProjectDialogAction extends Action<void|any> {
  readonly component = UpdateComponent;
  
  constructor(public project : any) {
    super();
  }
}

export class RemoveProjectDialogAction extends Action<boolean> {
  constructor(public project : any) {
    super();
  }
}

export class CreateProjectAction extends Action<void> {
  constructor(public project : any) {
    super();
  }
}

export class UpdateProjectAction extends Action<void> {
  constructor(public project : any) {
    super();
  }
}

export class RemoveProjectAction extends Action<void> {
  constructor(public project : any) {
    super();
  }
}
