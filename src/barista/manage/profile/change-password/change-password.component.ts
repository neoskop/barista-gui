import { Component, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dispatcher } from '../../../../dispatcher/dispatcher';
import { UpdatePasswordAction } from '../profile.actions';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'barista-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent {

  form = new FormGroup({
    current: new FormControl(null, [ Validators.required ]),
    updated: new FormGroup({
      value: new FormControl(null, [ Validators.required ]),
      repeat: new FormControl(null, [ Validators.required ])
    }, ({ value }) => {
      if(!value || !value.value || !value.repeat) {
        return null;
      }
      
      if(value.value !== value.repeat) {
        this.form.get('updated.repeat').setErrors({ repeat: true });
        return { repeat: true };
      }
      this.form.get('updated.repeat').setErrors(null);
      return null;
    })
  });
  
  constructor(protected dispatcher : Dispatcher, @Optional() protected dialogRef : MdDialogRef<ChangePasswordComponent>) { }

  submit() {
    this.dispatcher.dispatch(new UpdatePasswordAction(this.form.value.current, this.form.value.updated.value)).subscribe(() => {
      this.dialogRef.close();
    }, err => {
      if(err === 'BAD_REQUEST') {
        this.form.get('current').setErrors({ incorrect: true });
      }
    })
  }
}
