import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'barista-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  exportAs: 'form'
})
export class FormComponent implements OnInit {

  displayPassphrase = false;
  
  form = new FormGroup({
    _id: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(48),
      Validators.pattern(/^[a-z0-9_.-]+$/i)
    ]),
    name: new FormControl(null, [ Validators.required ]),
    security: new FormGroup({
      read: new FormControl('public', [ Validators.required ]),
      exec: new FormControl('restricted', [ Validators.required ])
    }),
    repository: new FormGroup({
      type: new FormControl('git', [ Validators.required ]),
      url: new FormControl(null, [ Validators.required ]),
      branch: new FormControl(null, [ Validators.required ])
    }),
    auth: new FormGroup({
      type: new FormControl('ssh-key', [ Validators.required ]),
      privateKey: new FormControl(null, [ Validators.required ]),
      publicKey: new FormControl(null, [ Validators.required ]),
      passphrase: new FormControl(null)
    })
  });
  
  constructor() { }

  ngOnInit() {
  }

  sshKeyFromFile(name : string, input : HTMLInputElement) {
    const reader = new FileReader();
    
    reader.onload = () => {
      this.form.get([ 'auth', name ]).setValue(reader.result);
      
      input.value = '';
    }
    
    reader.readAsText(input.files[0]);
  }
}
