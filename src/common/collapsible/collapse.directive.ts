import {  Directive,  Input,  Output,  EventEmitter,  HostListener,  ElementRef,  Renderer2} from '@angular/core';

/**
 * Toggles a `dui-collapsed` class on a target element when the host is clicked.
 * Used internally by {@link CollapsibleComponent}'s chevron icon, but can be applied standalone.
 * @zh 点击宿主元素时，切换目标元素上的 `dui-collapsed` 类。内部用于 {@link CollapsibleComponent} 的箭头图标，也可独立使用。
 */
@Directive({
  selector: '[duiCollapse]'
})
export class CollapseDirective {
  /**
   * The element whose collapsed/expanded CSS class is toggled.
   * @zh 被切换收起/展开 CSS 类的目标元素。
   */
  @Input()
  get target() {
    return this._target;
  }
  /**
   * The element whose collapsed/expanded CSS class is toggled.
   * @zh 被切换收起/展开 CSS 类的目标元素。
   */
  set target(value: Element) {
    this._target = value;
  }
  private _target: Element;

  /**
   * Current collapsed state; setting it applies/removes the CSS classes immediately.
   * @zh 当前收起状态；设置该值会立即应用/移除对应的 CSS 类。
   */
  @Input()
  get collapsed(): boolean {
    return this._collapsed;
  }
  /**
   * Current collapsed state; setting it applies/removes the CSS classes immediately.
   * @zh 当前收起状态；设置该值会立即应用/移除对应的 CSS 类。
   */
  set collapsed(collapsed: boolean) {
    collapsed ? this.collapseTarget() : this.expandTarget();
    this._collapsed = collapsed;
    this.toggle.emit(collapsed);
  }
  private _collapsed = false;

  /**
   * Emits the new collapsed state whenever it changes.
   * @zh 收起状态发生变化时发出新的状态值。
   */
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();

  /**
   * @hidden Handles clicks on the host element by toggling `collapsed`.
   * @zh 内部使用，处理宿主元素上的点击事件，切换 `collapsed` 状态。
   */
  @HostListener('click')
  click() {
    this.collapsed = !this.collapsed;
  }

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  private collapseTarget() {
    this.renderer.addClass(this.target, 'dui-collapsed');
    this.renderer.addClass(this.el.nativeElement, 'collapsed');
  }

  private expandTarget() {
    this.renderer.removeClass(this.target, 'dui-collapsed');
    this.renderer.removeClass(this.el.nativeElement, 'collapsed');
  }
}
