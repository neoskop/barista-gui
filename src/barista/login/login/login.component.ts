import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'barista-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl(null, [ Validators.required ]),
    password: new FormControl(null, [ Validators.required ])
  });
  
  constructor() { }

  ngOnInit() {
  }

}
