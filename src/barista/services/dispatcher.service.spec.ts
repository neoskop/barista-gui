import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { DispatcherService } from './dispatcher.service';

class SimpleAction {}
class SimpleAction2 {}

describe('DispatcherService', () => {
  let spy1 : jasmine.Spy;
  let spy2 : jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherService]
    });
    spy1 = jasmine.createSpy('Subscriber SimpleAction');
    spy2 = jasmine.createSpy('Subscriber SimpleAction2');
  });

  
  it('should dispatch actions async', fakeAsync(inject([DispatcherService], (service: DispatcherService) => {
    service.for(SimpleAction).subscribe(spy1);
    service.for(SimpleAction2).subscribe(spy2);
    
    const action = new SimpleAction();
    expect(service.dispatch(action)).toBe(action);
    
    
    expect(spy1).not.toHaveBeenCalled();
    tick();
    expect(spy1).toHaveBeenCalledWith(action);
    
    expect(spy2).not.toHaveBeenCalled();
  })));
  
  it('should allow side effects', fakeAsync(inject([DispatcherService], (service: DispatcherService) => {
    const action = new SimpleAction();
    const action2 = new SimpleAction2();
    const spy = jasmine.createSpy('effectFor').and.returnValue(action2);
    const spy3 = jasmine.createSpy('effectFor').and.returnValue(undefined);
    
    service.for(SimpleAction).subscribe(spy);
    service.for(SimpleAction2).subscribe(spy2);
    service.effectFor(SimpleAction, spy);
    service.effectFor(SimpleAction2, spy3);
    
    expect(service.dispatch(action)).toEqual(action);
    
    expect(spy).not.toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    
    tick();
  
    expect(spy).toHaveBeenCalledWith(action);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(action2);
    expect(spy3).not.toHaveBeenCalled();
    
    spy.calls.reset();
    spy1.calls.reset();
    spy2.calls.reset();
  
    expect(service.dispatch(action2)).toEqual(action2);
  
    expect(spy3).not.toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    
    tick();
  
    expect(spy3).toHaveBeenCalledWith(action2);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(action2);
    expect(spy).not.toHaveBeenCalled();
  })));
  
});
