import { inject, TestBed } from '@angular/core/testing';

import { SetupCheckGuard } from './setup-check.guard';
import { DispatcherService } from "../services/dispatcher.service";
import { SetupCheckAction } from "./setup.actions";

describe('SetupCheckGuard', () => {
  let spy : jasmine.SpyObj<DispatcherService>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SetupCheckGuard,
        { provide: DispatcherService, useValue: spy = jasmine.createSpyObj<DispatcherService>('DispatcherService', [ 'dispatch' ])}
      ]
    });
  });

  it('should should dispatch SetupCheckAction with isSetup property', inject([SetupCheckGuard], (guard: SetupCheckGuard) => {
    let action : SetupCheckAction;
  
    guard.canActivate(null, { url: '/setup' } as any);
  
    expect(spy.dispatch).toHaveBeenCalled();
    action = spy.dispatch.calls.argsFor(0)[0];
    expect(action instanceof SetupCheckAction).toBeTruthy();
    expect(action.isSetup).toBeTruthy();
    spy.dispatch.calls.reset();
  
    guard.canActivate(null, { url: '/foobar' } as any);
  
    expect(spy.dispatch).toHaveBeenCalled();
    action = spy.dispatch.calls.argsFor(0)[0];
    expect(action instanceof SetupCheckAction).toBeTruthy();
    expect(action.isSetup).toBeFalsy();
  }));
});
