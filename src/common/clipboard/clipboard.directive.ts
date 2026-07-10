
import {
  Directive, Input, HostListener, ViewContainerRef,  ComponentFactoryResolver
} from '@angular/core';
import { ClipboardService } from './clipboard.service';
import { ClipboardComponent } from './clipboard.component';

/**
 * Attach to any element to copy its associated text/content to the clipboard on click.
 * @zh 附加到任意元素上，点击时将关联的文本/内容复制到剪贴板。
 */
@Directive({
  selector: '[dui-clipboard]',
  exportAs: 'duiClipboard'
})
export class ClipboardDirective {

  /**
   * Tooltip text shown on hover before copying.
   * @zh 悬停时显示的提示文字。
   */
  @Input('dui-clipboard')
  placeholder: string;

  /**
   * Reference to the HTML element containing the text to copy.
   * @zh 包含待复制文本的 HTML 元素引用。
   */
  @Input()
  target: HTMLInputElement | HTMLTextAreaElement;

  /**
   * Toast message shown after a successful copy.
   * @zh 复制成功后显示的提示消息。
   */
  @Input('clipboard-notification') message: string;

  constructor(private clipboardService: ClipboardService,
    public viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver) { }

  /**
   * @hidden Handles a click on the host element by copying the target/content to the clipboard.
   * @zh 内部使用，处理宿主元素上的点击事件：将目标内容复制到剪贴板。
   */
  @HostListener('click', ['$event'])
  handleClickEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.copyToClipboard();
  }

  /**
   * @hidden Shows the {@link ClipboardComponent} tooltip on hover, if `placeholder` is set.
   * @zh 内部使用，悬停时若设置了 `placeholder` 则显示 {@link ClipboardComponent} 提示气泡。
   */
  @HostListener('mouseenter')
  showTooltip() {
    if (this.placeholder) {
      const componentFactory = this.resolver.resolveComponentFactory(ClipboardComponent);
      const componentRef = this.viewContainerRef.createComponent(componentFactory).instance;
      componentRef.placeholder = this.placeholder;
    }
  }

  /**
   * @hidden Removes the tooltip once the pointer leaves the host element.
   * @zh 内部使用，指针离开宿主元素后移除提示气泡。
   */
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
