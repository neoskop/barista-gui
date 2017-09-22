import { Resource } from '@neoskop/hrbac';
import { Pipe, PipeTransform, NgModule } from '@angular/core';

export class EntityResource extends Resource {
  constructor(resourceId : string, public entity : any) {
    super(resourceId);
  }
}

@Pipe({ name: 'entityResource' })
export class EntityResourcePipe implements PipeTransform {
  
  transform(value : any, resourceId : string) : EntityResource {
    return new EntityResource(resourceId, value);
  }
}

@NgModule({
  declarations: [ EntityResourcePipe ],
  exports: [ EntityResourcePipe ]
})
export class EntityResourceModule {

}
