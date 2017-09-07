import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmAction } from '../../barista.actions';

@Component({
  selector: 'barista-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.sass']
})
export class ConfirmComponent implements OnInit {

  constructor(@Optional() protected dialogRef : MdDialogRef<ConfirmComponent>,
              @Optional() @Inject(MD_DIALOG_DATA) protected action : any/*ConfirmAction*/) { }

  ngOnInit() {
  }
  
  confirm() {
    this.dialogRef.close(true);
  }
  
  cancel() {
    this.dialogRef.close(false);
  }

}
