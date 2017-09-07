import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'barista-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  exportAs: 'form'
})
export class FormComponent implements OnInit {
  @Input()
  update : any;
  
  protected browsers = Observable.of([
    'chrome',
    'firefox',
    'safari',
    'edge'
  ]);
  
  form = new FormGroup({
    id: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(48),
      Validators.pattern(/^[a-z0-9_.-]+$/i)
    ]),
    name: new FormControl(null, [ Validators.required ]),
    glob: new StringFormArray([]),
    browsers: new StringFormArray([]),
    options: new FormGroup({
      skipJsErrors: new FormControl(false, [ Validators.required ]),
      quarantineMode: new FormControl(false, [ Validators.required ]),
      selectorTimeout: new FormControl(10000, [ Validators.required ]),
      assertionTimeout: new FormControl(3000, [ Validators.required ]),
      speed: new FormControl(1, [ Validators.required ]),
    })
  });
  
  
  globInput = new FormControl(null);
  browserInput = new FormControl(null);
  filteredBrowsers = new BehaviorSubject<string[]>([]);
  
  constructor() {
  }

  ngOnInit() {
    this.browsers.repeatWhen(n => this.browserInput.valueChanges).map(browsers => {
      browsers.sort();
      const input = this.browserInput.value;
      if(!input) {
        return browsers;
      }
    
      const filter = input.toLowerCase().split(/\s+/);
    
      return browsers.filter(browser => {
        return filter.every(f => {
          return -1 < browser.indexOf(f);
        })
      })
    }).subscribe(this.filteredBrowsers)
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
    if(this.filteredBrowsers.value.includes(value)) {
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
