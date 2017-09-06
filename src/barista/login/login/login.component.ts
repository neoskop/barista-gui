import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DispatcherService } from '../../services/dispatcher.service';
import { LoginAction } from "../login.actions";

@Component({
  selector: 'barista-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  error : string | null = null;
  
  form = new FormGroup({
    username: new FormControl(null, [ Validators.required ]),
    password: new FormControl(null, [ Validators.required ])
  });
  
  constructor(protected dispatcher : DispatcherService) { }

  ngOnInit() {
  }
  
  submit() {
    if(this.form.valid && this.form.enabled) {
      this.error = null;
      this.form.disable();
      this.dispatcher.dispatch(new LoginAction(this.form.value.username, this.form.value.password)).subscribe(null, error => {
        this.form.enable();
        this.error = error;
      });
    }
  }
}
