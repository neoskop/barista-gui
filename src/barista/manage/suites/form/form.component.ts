import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dispatcher } from "../../../../dispatcher/dispatcher";
import { BrowserListAction } from '../../../testcafe.actions';

@Component({
  selector   : 'barista-form',
  templateUrl: './form.component.html',
  styleUrls  : [ './form.component.sass' ],
  exportAs   : 'form'
})
export class FormComponent implements OnInit {
  @Input()
  update : any;
  
  form = new FormGroup({
    id      : new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(48),
      Validators.pattern(/^[a-z0-9_.-]+$/i)
    ]),
    name    : new FormControl(null, [ Validators.required ]),
    glob    : new StringFormArray([]),
    browsers: new StringFormArray([]),
    options : new FormGroup({
      skipJsErrors    : new FormControl(false, [ Validators.required ]),
      quarantineMode  : new FormControl(false, [ Validators.required ]),
      selectorTimeout : new FormControl(10000, [ Validators.required ]),
      assertionTimeout: new FormControl(3000, [ Validators.required ]),
      speed           : new FormControl(1, [ Validators.required ]),
    })
  });
  
  get globControls() {
    return (this.form.get('glob') as FormArray).controls;
  }
  
  get browsersControls() {
    return (this.form.get('browsers') as FormArray).controls;
  }
  
  globInput = new FormControl(null);
  browserInput = new FormControl(null);
  browsers = new BehaviorSubject<string[]>([]);
  
  browserFilter = new BehaviorSubject('');
  
  constructor(protected dispatcher : Dispatcher) {
  }
  
  ngOnInit() {
    this.browserInput.valueChanges.subscribe(this.browserFilter);
    this.dispatcher.dispatch(new BrowserListAction()).mergeMap(browsers => {
      return this.browserFilter.map(value => ({ browsers, value }));
    }).map(({ browsers, value }) => {
      browsers.sort();
      if(!value) {
        return browsers.slice(0, 50);
      }
      
      const filter = value.toLowerCase().split(/\s+/);
      
      return browsers.filter(browser => {
        return filter.every(f => {
          return '-' === f.charAt(0) ? !browser.toLowerCase().includes(f.substr(1)) : browser.toLowerCase().includes(f);
        })
      }).slice(0, 50);
    }).subscribe(this.browsers);
  }
  
  
  add(path : string, control : FormControl, value : string) {
    const form = this.form.get(path) as FormArray;
    control.setValue('');
    for(const control of form.controls) {
      if(control.value == value) {
        return;
      }
    }
    form.push(new FormControl(value));
  }
  
  addBrowserConditional(value : string) {
    if(this.browsers.value.includes(value)) {
      this.add('browsers', this.browserInput, value);
    }
  }
  
  remove(path : string, index : number) {
    (this.form.get(path) as FormArray).removeAt(index);
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
