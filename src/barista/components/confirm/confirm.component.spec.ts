import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;
  let spy : jasmine.SpyObj<MdDialogRef<any>>;
  let data : any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmComponent ],
      providers: [
        { provide: MdDialogRef, useValue: spy = jasmine.createSpyObj<MdDialogRef<any>>('MdDialogRef', [ 'close' ]) },
        { provide: MD_DIALOG_DATA, useValue: data = {
          text: 'Test Text',
          confirmBtnText: 'CONFIRM',
          cancelBtnText: 'CANCEL'
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display texts', () => {
    expect(fixture.debugElement.nativeElement.querySelector('p').textContent).toBe('Test Text');
    expect(fixture.debugElement.nativeElement.querySelector('button:nth-child(1)').textContent).toBe('CONFIRM');
    expect(fixture.debugElement.nativeElement.querySelector('button:nth-child(2)').textContent).toBe('CANCEL');
  });
  
  it('should return true on confirm', () => {
    fixture.debugElement.nativeElement.querySelector('button:nth-child(1)').click();
    
    expect(spy.close).toHaveBeenCalledWith(true)
  });
  
  it('should return false on cancel', () => {
    fixture.debugElement.nativeElement.querySelector('button:nth-child(2)').click();
    
    expect(spy.close).toHaveBeenCalledWith(false)
  });
});
