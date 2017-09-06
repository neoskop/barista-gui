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
