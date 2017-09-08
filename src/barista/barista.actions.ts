import { ConfirmComponent } from './components/confirm/confirm.component';
import { ComponentType } from '@angular/cdk/portal';
import { MdDialogConfig } from '@angular/material';
import { Action } from '../dispatcher/dispatcher';

export class ConfirmDialogAction extends Action<boolean> {
  text : string;
  confirmBtnText : string;
  cancelBtnText : string;
  component : ComponentType<any>;
  config : MdDialogConfig;
  
  constructor(text : string, {
    confirmBtnText = 'Ok',
    cancelBtnText = 'Cancel',
    component = ConfirmComponent,
    config = {}
  } : { confirmBtnText?: string, cancelBtnText?: string, component?: ComponentType<any>, config?: MdDialogConfig } = {}) {
    super();
    
    this.text = text;
    this.confirmBtnText = confirmBtnText;
    this.cancelBtnText = cancelBtnText;
    this.component = component;
    this.config = config;
  }
}
