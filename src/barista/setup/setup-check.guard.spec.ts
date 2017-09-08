import { inject, TestBed } from '@angular/core/testing';

import { SetupCheckGuard } from './setup-check.guard';
import { SetupCheckAction } from "./setup.actions";
import { Dispatcher } from '../../dispatcher/dispatcher';

describe('SetupCheckGuard', () => {
  let spy : jasmine.SpyObj<Dispatcher>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SetupCheckGuard,
        { provide: Dispatcher, useValue: spy = jasmine.createSpyObj<Dispatcher>('DispatcherService', [ 'dispatch' ])}
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
