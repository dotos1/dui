import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[duiStopDropPropagation]'
})
export class StopDropPropagationDirective {
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
