import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'barista-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.sass']
})
export class UpdateComponent implements OnInit {
  @ViewChild(FormComponent) form : FormComponent;
  
  constructor(@Optional() protected dialogRef : MdDialogRef<UpdateComponent>,
              @Optional() @Inject(MD_DIALOG_DATA) protected project : any) { }
  
  ngOnInit() {
    this.form.form.patchValue(this.project);
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


