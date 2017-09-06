import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DispatcherService } from '../../services/dispatcher.service';
import { LoginAction } from '../../services/api.service';

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
    this.error = null;
    this.dispatcher.dispatch(new LoginAction(this.form.value.username, this.form.value.password)).subscribe(null, error => {
      this.error = error;
    });
  }
}
