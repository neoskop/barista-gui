import { ContentChildren, Directive, forwardRef, Input, QueryList, AfterContentInit } from '@angular/core';
import { MdTab, MdTabGroup } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RADIO_TABS_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioTabsDirective),
  multi: true
};

export const TAB_VALUE_MAP = new WeakMap<MdTab, any>();

@Directive({
  selector: 'md-tab-group[baristaRadioTabs]',
  providers: [
    RADIO_TABS_VALUE_ACCESSOR
  ]
})
export class RadioTabsDirective implements ControlValueAccessor, AfterContentInit {
  onChange = (_ : any) => {};
  onTouched = () => {};
  
  contentInit = (() => {
    let resolve : any;
    const promise : Promise<void> & { resolve?() : void } = new Promise<void>((res) => {
      resolve = res;
    });
    promise.resolve = resolve;
    return promise;
  })();
  
  @ContentChildren(MdTab) tabs : QueryList<MdTab>;
  
  constructor(protected tabGroup : MdTabGroup) {
    tabGroup.selectChange.subscribe(event => {
      const value = TAB_VALUE_MAP.get(event.tab);
      this.onChange(value);
    })
  }
  
  ngAfterContentInit() : void {
    this.contentInit.resolve();
  }
  
  async writeValue(obj : any, noTimeout? : boolean) : Promise<void> {
    await this.contentInit;
    let i = 0;
    for(const tab of this.tabs.toArray()) {
      const value = TAB_VALUE_MAP.get(tab);
      if(value === obj) {
        this.tabGroup.selectedIndex = i;
        return;
      }
      ++i;
    }
  }
  
  registerOnChange(fn : any) : void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn : any) : void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled : boolean) : void {
    for(const tab of this.tabs.toArray()) {
      tab.disabled = isDisabled;
    }
  }
}

@Directive({
  selector: 'md-tab[value]'
})
export class RadioTabValueDirective {
  @Input() set value(value : any) {
    TAB_VALUE_MAP.set(this.tab, value);
  }
  
  constructor(protected tab : MdTab) {
  
  }
}
