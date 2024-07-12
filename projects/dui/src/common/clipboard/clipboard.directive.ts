
import {
  Directive, Input, HostListener, ViewContainerRef,  ComponentFactoryResolver
} from '@angular/core';
import { ClipboardService } from './clipboard.service';
import { ClipboardComponent } from './clipboard.component';

@Directive({
  selector: '[dui-clipboard]',
  exportAs: 'duiClipboard'
})
export class ClipboardDirective {

  @Input('dui-clipboard')
  placeholder: string;

  /** Reference to the HTML element containing the text to copy. */
  @Input()
  target: HTMLInputElement | HTMLTextAreaElement;

  @Input('clipboard-notification') message: string;

  constructor(private clipboardService: ClipboardService,
    public viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver) { }

  @HostListener('click', ['$event'])
  handleClickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.copyToClipboard();
  }

  @HostListener('mouseenter')
  showTooltip() {
    if (this.placeholder) {
      const componentFactory = this.resolver.resolveComponentFactory(ClipboardComponent);
      const componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
      componentRef.placeholder = this.placeholder;
    }
  }

  @HostListener('mouseleave')
  closeTooltip() {
    this.viewContainerRef.remove();
  }

  private copyToClipboard() {
    const isValidTarget = this.clipboardService.isTargetValid(this.target);

    if (isValidTarget) {
      this.clipboardService.copyToClipboard(this.target, this.message);
    } else {
      this.copyContentToClipboard(this.viewContainerRef.element.nativeElement.innerHTML);
    }
  }

  private copyContentToClipboard(content:any) {
    this.clipboardService.copyContentToClipboard(content, this.message);
  }
}
