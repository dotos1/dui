/**
 * @fileoverview Module `src/common/collapsible/collapse.directive.ts` providing collapse directive definitions and implementation.
 * @zh 模块文件 `src/common/collapsible/collapse.directive.ts`，提供折叠指令相关的定义与实现。
 */

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
  /**
   * Property `_target` (`Element`) storing target.
   * @zh 属性 `_target`（类型：`Element`），用于存储或配置目标。
   */
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
  /**
   * Property `_collapsed` (`boolean`) storing collapsed (default: `false`).
   * @zh 属性 `_collapsed`（类型：`boolean`），用于存储或配置已折叠（默认值：`false`）。
   */
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

  /**
   * Creates an instance of `CollapseDirective` and initializes its dependencies and internal state.
   * @zh 创建 `CollapseDirective` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   */
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  /**
   * Executes `collapseTarget` to handle collapse target.
   * @zh 执行 `collapseTarget`，用于折叠目标。
   */
  private collapseTarget() {
    this.renderer.addClass(this.target, 'dui-collapsed');
    this.renderer.addClass(this.el.nativeElement, 'collapsed');
  }

  /**
   * Executes `expandTarget` to handle expand target.
   * @zh 执行 `expandTarget`，用于展开目标。
   */
  private expandTarget() {
    this.renderer.removeClass(this.target, 'dui-collapsed');
    this.renderer.removeClass(this.el.nativeElement, 'collapsed');
  }
}
