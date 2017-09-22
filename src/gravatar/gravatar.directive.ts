import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import * as md5 from 'md5';

@Directive({
  selector: 'img[neoGravatar]'
})
export class GravatarDirective implements OnChanges {
  @Input('neoGravatar') email : string;
  @Input('size') size : number = 16;
  @Input('fallback') fallback : string = 'mm';
  
  constructor(protected elementRef : ElementRef, protected renderer : Renderer2) { }
  
  ngOnChanges() : void {
    const src = `//www.gravatar.com/avatar/${md5(this.email)}?s=${this.size}&d=${this.fallback}`;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'src', src);
  }
}
