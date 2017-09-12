import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'barista-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.sass']
})
export class ConfirmComponent implements OnInit {

  constructor(@Optional() protected dialogRef : MdDialogRef<ConfirmComponent>,
              @Optional() @Inject(MD_DIALOG_DATA) public action : any) { }

  ngOnInit() {
  }
  
  confirm() {
    this.dialogRef.close(true);
  }
  
  cancel() {
    this.dialogRef.close(false);
  }

}
