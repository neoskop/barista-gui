export type Filter = (value : any) => boolean;
export type StaticMetadata = { type: any, args: any[] };
export type StaticMetadataClass = { propDecorators?: StaticMetadata[] } & Function;

declare const Reflect : any;

export interface EffectMetadata {
  filter: Filter,
  methodName: string;
}

const METADATA_KEY = '@neo/dispatcher/effects';

function hasStaticMetadata(cls : StaticMetadataClass) : boolean {
  return !!cls.propDecorators;
}

function getStaticEffectMetadata(cls : StaticMetadataClass) {
  return Object.keys(cls.propDecorators).reduce((r, c) => r.concat(getStaticEffectMetadataForMethod(cls.propDecorators[c], c)), []);
}

function getStaticEffectMetadataForMethod(entries : StaticMetadata[], methodName: string) : EffectMetadata[] {
  const effectMetadata = entries.filter(e => e.type === Effect).map(e => ({
    filter: e.args[0],
    methodName
  }));
  
  const effectForMetadata = entries.filter(e => e.type === EffectFor).map(e => ({
    filter: v => v.constructor === e.args[0],
    methodName
  }));
  
  return [ ...effectMetadata, ...effectForMetadata ];
}

export function getEffectMetadata(protoOrInstance: { constructor: Function|StaticMetadataClass }|Function|StaticMetadataClass) : EffectMetadata[] {
  const cls : StaticMetadataClass = (protoOrInstance as any).constructor || protoOrInstance;
  if(hasStaticMetadata(cls)) {
    return getStaticEffectMetadata(cls);
  }
  
  if(Reflect.hasOwnMetadata(METADATA_KEY, cls)) {
    return Reflect.getOwnMetadata(METADATA_KEY, cls);
  }
  
  return [];
}

function setEffectMetadata(protoOrInstance: { constructor: Function|StaticMetadataClass }|Function|StaticMetadataClass, metadata : EffectMetadata[]) : void {
  const cls : StaticMetadataClass = (protoOrInstance as any).constructor || protoOrInstance;
  Reflect.defineMetadata(METADATA_KEY, metadata, cls);
}

export function Effect(filter: Filter) : MethodDecorator {
  return (target: Object, methodName: string) => {
    const effects = getEffectMetadata(target);
    
    setEffectMetadata(target, [ ...effects, { filter, methodName } ]);
  }
}

export function EffectFor(cls : Function) : MethodDecorator {
  return (target: Object, methodName: string) => {
    const effects = getEffectMetadata(target);
  
    setEffectMetadata(target, [ ...effects, {
      filter: v => v.constructor === cls,
      methodName
    } ]);
  }
}
