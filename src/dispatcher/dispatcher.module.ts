import { Inject, InjectionToken, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Dispatcher } from './dispatcher';
import { getEffectMetadata } from './metadata';

export const ROOT_EFFECTS = new InjectionToken<any[]>('@neo/dispatcher/ROOT_EFFECTS');
export const CHILD_EFFECTS = new InjectionToken<any[]>('@neo/dispatcher/CHILD_EFFECTS');

export function effectFactory(...effects : any[]) {
  return effects;
}

@NgModule({})
export class DispatcherModule {
  static forRoot(rootEffects : Type<any>[]) : ModuleWithProviders {
    return {
      ngModule: RootDispatcherModule,
      providers: [
        Dispatcher,
        rootEffects,
        {
          provide: ROOT_EFFECTS,
          deps: rootEffects,
          useFactory: effectFactory
        }
      ]
    }
  }
  
  static forChild(effects : Type<any>[]) : ModuleWithProviders {
    return {
      ngModule: ChildDispatcherModule,
      providers: [
        effects,
        {
          provide: CHILD_EFFECTS,
          deps: effects,
          multi: true,
          useFactory: effectFactory
        }
      ]
    }
  }
}


@NgModule({})
export class RootDispatcherModule {
  constructor(protected dispatcher : Dispatcher,
              @Inject(ROOT_EFFECTS) rootEffects : any[]) {

    for(const effect of rootEffects) {
      this.addEffect(effect);
    }

    dispatcher.start();
  }
  
  addEffect(effect : any) {
    const metadata = getEffectMetadata(effect);

    for(const { filter, methodName } of metadata) {
      this.dispatcher.effect(filter, o => {
        const returnValue = effect[methodName](o);

        if(!returnValue || typeof returnValue.subscribe !== 'function') {
          throw new Error(`Returned value of "${effect.constructor.name}:${methodName}" is no observable.`)
        }

        return returnValue;
      })
    }
  }
}


@NgModule({})
export class ChildDispatcherModule {
  constructor(root : RootDispatcherModule, @Inject(CHILD_EFFECTS) childEffects : any[][]) {
    if(childEffects) {
      for(const group of childEffects) {
        for(const effect of group) {
          root.addEffect(effect);
        }
      }
    }
  }
}
