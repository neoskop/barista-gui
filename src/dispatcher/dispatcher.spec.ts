import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { Action, Dispatcher } from './dispatcher';

class SimpleAction {}
class SimpleAction2 {}
class SimpleAction3 {}


describe('DispatcherService', () => {
  let spy1 : jasmine.Spy;
  let spy2 : jasmine.Spy;
  let spy3 : jasmine.Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Dispatcher]
    });
    spy1 = jasmine.createSpy('Subscriber SimpleAction');
    spy2 = jasmine.createSpy('Subscriber SimpleAction2');
    spy3 = jasmine.createSpy('Subscriber SimpleAction3');
  });

  
  it('should dispatch actions async', fakeAsync(inject([Dispatcher], (service: Dispatcher) => {
    service.start();
    service.for(SimpleAction).subscribe(spy1);
    service.for(SimpleAction2).subscribe(spy2);

    const action = new SimpleAction();
    expect(service.dispatch(action)).toBe(action);


    expect(spy1).not.toHaveBeenCalled();
    tick();

    expect(spy1).toHaveBeenCalledWith(action);
    expect(spy2).not.toHaveBeenCalled();
  })));
  
  it('should allow side effects', fakeAsync(inject([Dispatcher], (service: Dispatcher) => {
    service.start();
    const action = new SimpleAction();
    const action2 = new SimpleAction2();
    const action3 = new SimpleAction3();
    const effectForSpy = jasmine.createSpy('effectFor1').and.returnValue(action3);
    const effectFor2Spy = jasmine.createSpy('effectFor2').and.returnValue(undefined);
    
    service.for(SimpleAction).subscribe(spy1);
    service.for(SimpleAction2).subscribe(spy2);
    service.for(SimpleAction3).subscribe(spy3);
    service.effectFor(SimpleAction, effectForSpy);
    service.effectFor(SimpleAction2, effectFor2Spy);

    expect(service.dispatch(action)).toEqual(action);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(effectForSpy).not.toHaveBeenCalled();
    expect(effectFor2Spy).not.toHaveBeenCalled();

    tick();
    
    expect(effectForSpy).toHaveBeenCalledWith(action);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledWith(action3);
    expect(effectFor2Spy).not.toHaveBeenCalled();
    
    spy1.calls.reset();
    spy2.calls.reset();
    spy3.calls.reset();
    effectForSpy.calls.reset();
    effectFor2Spy.calls.reset();

    expect(service.dispatch(action2)).toEqual(action2);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(effectForSpy).not.toHaveBeenCalled();
    expect(effectFor2Spy).not.toHaveBeenCalled();

    tick();
  
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(action2);
    expect(spy3).not.toHaveBeenCalled();
    expect(effectForSpy).not.toHaveBeenCalled();
    expect(effectFor2Spy).toHaveBeenCalledWith(action2);
  })));
  
  it('should return provided action as return channel', fakeAsync(inject([Dispatcher], (service: Dispatcher) => {
    service.start();
    const action = new Action<any>();
    const handlerSpy = jasmine.createSpy('handler').and.callFake(action => {
      action.next('RETURN_VALUE');
    });
    const returnSpy = jasmine.createSpy('return');

    service.for(Action).subscribe(handlerSpy);

    expect(handlerSpy).not.toHaveBeenCalled();
    expect(returnSpy).not.toHaveBeenCalled();

    const observable = service.dispatch(action);
    observable.subscribe(returnSpy);

    expect(handlerSpy).not.toHaveBeenCalled();
    expect(returnSpy).not.toHaveBeenCalled();

    tick();

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith(action);

    expect(returnSpy).toHaveBeenCalledTimes(1);
    expect(returnSpy).toHaveBeenCalledWith('RETURN_VALUE');


  })));
  
});
