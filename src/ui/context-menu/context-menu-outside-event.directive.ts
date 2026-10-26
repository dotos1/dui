/**
 * @fileoverview Module `src/ui/context-menu/context-menu-outside-event.directive.ts` providing context menu outside event directive definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu-outside-event.directive.ts`，提供上下文菜单外部事件指令相关的定义与实现。
 */


import {
  Directive,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Angular directive `OutsideEventDirective` (selector: '[duiContextMenuOutsideEvent]') attaching outside event directive behavior to host DOM elements.
 * @zh Angular 指令 `OutsideEventDirective`（selector: '[duiContextMenuOutsideEvent]'），为宿主 DOM 元素附加外部事件指令行为。
 */
@Directive({
  selector: '[duiContextMenuOutsideEvent]'
})
export class OutsideEventDirective implements OnInit, OnDestroy {
  /**
   * Property `subscriptions` (`Subscription[]`) storing subscriptions (default: `[]`).
   * @zh 属性 `subscriptions`（类型：`Subscription[]`），用于存储或配置订阅集合（默认值：`[]`）。
   */
  private subscriptions: Subscription[] = [];

  /**
   * Output event emitter `clickOutside` (`EventEmitter<void>`) firing when click outside occurs.
   * @zh 输出事件 `clickOutside`（类型：`EventEmitter<void>`），当触发点击外部时向外发出事件。
   */
  @Output()
  clickOutside: EventEmitter<void> = new EventEmitter();

  /**
   * Creates an instance of `OutsideEventDirective` and initializes its dependencies and internal state.
   * @zh 创建 `OutsideEventDirective` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.subscriptions = this.subscriptions.concat([
      fromEvent(document.body, 'click')
        .pipe(filter((event) => !this.findAncestor(event.target as Element)))
        .subscribe(() => this.clickOutside.next())
    ]);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Executes `findAncestor` to handle find ancestor.
   * @zh 执行 `findAncestor`，用于查找祖先节点。
   * @param el - el parameter (`Element`) / DOM元素参数（`Element`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private findAncestor(el: Element): boolean {

    if(el.tagName=='CANVAS'){
      return true;
    }
    const className = 'dui-context-menu';

    if (el.classList.contains(className)) {
      return true;
    }
    while ((el = el.parentElement) && !el.classList.contains(className));
    return !!el;
  }
}
