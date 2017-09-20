import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcafeErrorComponent } from './testcafe-error.component';

describe('TestcafeErrorComponent', () => {
  let component: TestcafeErrorComponent;
  let fixture: ComponentFixture<TestcafeErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcafeErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcafeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
