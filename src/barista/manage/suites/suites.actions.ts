import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { ISearchAction } from "../../datasource";
import { Action } from '../../../dispatcher/dispatcher';

export class CreateSuiteDialogAction extends Action<void|any> {
  readonly component = CreateComponent;
  
  constructor(public projectId : string) {
    super();
  }
}

export class UpdateSuiteDialogAction extends Action<void|any> {
  readonly component = UpdateComponent;
  
  constructor(public projectId : string, public suite : any) {
    super();
  }
}

export class RemoveSuiteDialogAction extends Action<boolean> {
  constructor(public projectId : string, public suite : any) {
    super();
  }
}

export class SearchSuiteAction extends Action<any[]> implements ISearchAction {
  constructor(public projectId : string, public params : {
    filter?: string;
    sort?: string;
    order?: string;
    offset?: number;
    limit?: number;
  }) {
    super();
  }
}

export class CreateSuiteAction extends Action<any> {
  constructor(public projectId : string, public suite : any) {
    super();
  }
}

export class UpdateSuiteAction extends Action<any> {
  constructor(public projectId : string, public suite : any) {
    super();
  }
}

export class RemoveSuiteAction extends Action<void> {
  constructor(public projectId : string, public suite : any) {
    super();
  }
}

export class ReadSuiteAction extends Action<any> {
  constructor(public projectId : string, public suiteId : string) {
    super();
  }
}
