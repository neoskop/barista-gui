import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { MdDialogRef } from '@angular/material';
import { Action } from '../../../services/dispatcher.service';

@Component({
  selector: 'barista-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent implements OnInit {
  @ViewChild(FormComponent) form : FormComponent;
  
  constructor(@Optional() protected dialogRef : MdDialogRef<CreateComponent>) { }
  
  ngOnInit() {
  }
  
  async submit() {
    if(this.form.form.valid) {
      this.dialogRef.close(this.form.form.value);
    }
  }
  
  cancel() {
    this.dialogRef.close();
  }
}

export class CreateSuiteDialogAction extends Action<void|any> {
  readonly component = CreateComponent;
}
