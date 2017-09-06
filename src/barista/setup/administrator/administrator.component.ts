import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'barista-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.sass']
})
export class AdministratorComponent implements OnInit {
  protected validateRepeatPassword = ({ value } : AbstractControl) : ValidationErrors | null => {
    if(null == value) {
      return null;
    }
    
    if(value === this.form.value.password) {
      return null;
    }
    
    return { repeat: true }
  }
  
  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(32),
      Validators.pattern(/^[a-z0-9\-_.]+$/i)
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(null, [
      Validators.required
    ]),
    repeat: new FormControl(null, [
      Validators.required,
      this.validateRepeatPassword
    ])
  });
  
  constructor() { }

  ngOnInit() {
  }

}
