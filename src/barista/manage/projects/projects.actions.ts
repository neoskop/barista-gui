import { Action } from '../../services/dispatcher.service';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { ISearchAction } from '../../datasource';

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

export class SearchProjectAction extends Action<any[]> implements ISearchAction {
  constructor(public params : {
    filter?: string;
    sort?: string;
    order?: string;
    offset?: number;
    limit?: number;
  }) {
    super();
  }
}

export class CreateProjectAction extends Action<any> {
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
