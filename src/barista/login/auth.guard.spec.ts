import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthCheckAction } from './login.actions';
import { Dispatcher } from '../../dispatcher/dispatcher';

describe('AuthGuard', () => {
  let spy : jasmine.SpyObj<Dispatcher>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Dispatcher, useValue: spy = jasmine.createSpyObj<Dispatcher>('DispatcherService', [ 'dispatch' ])}
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
