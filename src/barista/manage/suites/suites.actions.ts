import { Action } from '../../services/dispatcher.service';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';

export class CreateSuiteDialogAction extends Action<void|any> {
  readonly component = CreateComponent;
}

export class UpdateSuiteDialogAction extends Action<void|any> {
  readonly component = UpdateComponent;
  
  constructor(public suite : any) {
    super();
  }
}
