import { ISearchAction } from '../../datasource';
import { Action } from "../../../dispatcher/dispatcher";

export class CreateUserDialogAction extends Action<void|any> {
}


export class UpdateUserDialogAction extends Action<void|any> {
  constructor(public project : any) {
    super();
  }
}

export class RemoveUserDialogAction extends Action<boolean> {
  constructor(public user : any) {
    super();
  }
}

export class SearchUserAction extends Action<any[]> implements ISearchAction {
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

export class CreateUserAction extends Action<any> {
  constructor(public user : any) {
    super();
  }
}

export class UpdateUserAction extends Action<any> {
  constructor(public user : any) {
    super();
  }
}

export class RemoveUserAction extends Action<void> {
  constructor(public user : any) {
    super();
  }
}

export class ReadUserAction extends Action<any> {
  constructor(public userId : string, public fetch? : string) {
    super();
  }
}
