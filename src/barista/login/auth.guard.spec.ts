import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { DispatcherService } from "../services/dispatcher.service";
import { AuthCheckAction } from './login.actions';

describe('AuthGuard', () => {
  let spy : jasmine.SpyObj<DispatcherService>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: DispatcherService, useValue: spy = jasmine.createSpyObj<DispatcherService>('DispatcherService', [ 'dispatch' ])}
      ]
    });
  });

  it('should should dispatch AuthCheckAction with isLogin property', inject([AuthGuard], (guard: AuthGuard) => {
    let action : AuthCheckAction;
    
    guard.canActivate(null, { url: '/login' } as any);
    
    expect(spy.dispatch).toHaveBeenCalled();
    action = spy.dispatch.calls.argsFor(0)[0];
    expect(action instanceof AuthCheckAction).toBeTruthy();
    expect(action.isLogin).toBeTruthy();
    spy.dispatch.calls.reset();
    
    guard.canActivate(null, { url: '/foobar' } as any);
  
    expect(spy.dispatch).toHaveBeenCalled();
    action = spy.dispatch.calls.argsFor(0)[0];
    expect(action instanceof AuthCheckAction).toBeTruthy();
    expect(action.isLogin).toBeFalsy();
  }));
});
