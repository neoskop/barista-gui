import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BaristaComponent } from './barista.component';
import { MdProgressBarModule } from '@angular/material';
import { LoadingInterceptor } from "./http-interceptors/loading.interceptor";

describe('BaristaComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MdProgressBarModule
      ],
      declarations: [
        BaristaComponent
      ],
      providers: [
        LoadingInterceptor
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(BaristaComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
