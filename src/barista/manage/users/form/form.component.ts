import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HierarchicalRoleBaseAccessControl } from '@neoskop/hrbac';
import { RoleStore } from '@neoskop/hrbac/lib/ng';

@Component({
  selector: 'barista-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  exportAs: 'form'
})
export class FormComponent implements OnInit {
  @Input()
  update : any;
  
  form = new FormGroup({
    _id: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(32),
      Validators.pattern(/^[a-z0-9_.-]+$/i)
    ]),
    email: new FormControl(null, [ Validators.required, Validators.email ]),
    password: new FormControl(null, [ Validators.required ]),
    repeat: new FormControl(null, [ Validators.required ]),
    roles: new StringFormArray([])
  }, ({ value }) => {
    if(!value || !value.password) {
      if(this.form) {
        this.form.get('repeat').setErrors(null);
      }
      return null;
    }
    
    if(!value.repeat) {
      this.form.get('repeat').setErrors({ required: true });
      return { 'repeat.required': true };
    }
  
    if(value.repeat && value.password !== value.repeat) {
      this.form.get('repeat').setErrors({ repeat: true });
      return { 'repeat.repeat': true };
    }
    this.form.get('repeat').setErrors(null);
    return null;
  });
  
  _roles = [
    '_admin',
    'admin',
    'manager',
    'user'
  ];
  
  roles : Observable<string[]>;
  
  roleInput = new FormControl();
  roleFilter = new BehaviorSubject('');
  
  get roleControls() {
    return (this.form.get('roles') as FormArray).controls;
  }
  
  constructor(protected hrbac : HierarchicalRoleBaseAccessControl, protected roleStore : RoleStore) { }
  
  ngOnInit() : void {
    if(this.update) {
      this.form.get('password').setErrors(null);
      this.form.get('repeat').setErrors(null);
      this.form.get('password').setValidators([]);
      this.form.get('repeat').setValidators([]);
    }
    this.roleInput.valueChanges.subscribe(this.roleFilter);
    this.roles = Observable.of(this._roles).mergeMap(roles => {
      return this.roleFilter.map(value => ({ roles, value }));
    }).map(({ roles, value }) => {
      roles = roles.filter(role => this.hrbac.isAllowed(this.roleStore.getRole(), 'role', role));
      roles.sort();
      if(!value) {
        return roles;
      }
  
      const filter = value.toLowerCase().split(/\s+/);
  
      return roles.filter(role => {
        return filter.every(f => {
          return '-' === f.charAt(0) ? !role.toLowerCase().includes(f.substr(1)) : role.toLowerCase().includes(f);
        });
      });
    })
  }
  
  addRole(role : string) {
    const form = this.form.get('roles') as StringFormArray;
    this.roleInput.setValue('');
    for(const control of form.controls) {
      if(control.value === role) {
        return;
      }
    }
    form.push(new FormControl(role));
  }
  
  addRoleConditional(role : string) {
    if(this._roles.includes(role)) {
      this.addRole(role);
    }
  }
  
  removeRole(index : number) {
    const form = this.form.get('roles') as StringFormArray;
    form.removeAt(index);
  }
}


class StringFormArray extends FormArray {
  
  
  patchValue(value : any[], options? : { onlySelf? : boolean; emitEvent? : boolean }) : void {
    while(this.length) {
      this.removeAt(0);
    }
    if(value) {
      for(const v of value) {
        this.push(new FormControl(v));
      }
    }
    super.patchValue(value, options);
  }
}
