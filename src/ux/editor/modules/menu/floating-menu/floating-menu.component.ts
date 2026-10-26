/**
 * @fileoverview Module `src/ux/editor/modules/menu/floating-menu/floating-menu.component.ts` providing floating menu component definitions and implementation.
 * @zh 模块文件 `src/ux/editor/modules/menu/floating-menu/floating-menu.component.ts`，提供floating菜单组件相关的定义与实现。
 */

import {
  Component, ElementRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit,
} from '@angular/core';
import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { asyncScheduler, fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import type { VirtualElement } from '@floating-ui/core';
import { computePosition, detectOverflow, offset, autoPlacement } from '@floating-ui/dom';


import { Editor } from '../../../Editor';
import EditorError from '../../../utils/error';

/**
 * Interface `BubblePosition` defining the contract and properties for bubble position.
 * @zh 接口 `BubblePosition`，定义Bubble位置的数据结构契约与属性规范。
 */
interface BubblePosition {
  /**
   * Property `top` (`number`) storing top.
   * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
   */
  top: number;
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number;
}

/**
 * Angular component `FloatingMenuComponent` (selector: 'editor-floating-menu') providing floating menu component presentation and interaction in `src/ux/editor/modules/menu/floating-menu`.
 * @zh Angular 组件 `FloatingMenuComponent`（selector: 'editor-floating-menu'），提供Floating菜单组件的视图渲染与交互逻辑（位于 `src/ux/editor/modules/menu/floating-menu`）。
 */
@Component({
  selector: 'editor-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss'],
  
})
export class FloatingMenuComponent implements OnInit, OnDestroy {
  /**
   * Creates an instance of `FloatingMenuComponent` and initializes its dependencies and internal state.
   * @zh 创建 `FloatingMenuComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef<HTMLElement>`) / 注入或传入的DOM元素（`ElementRef<HTMLElement>`）
   */
  constructor(public el: ElementRef<HTMLElement>) { }

  /**
   * Host-bound getter `display` (`style`) computing display.
   * @zh 宿主绑定读取器 `display`（绑定至 `style`），计算并返回display。
   */
  @HostBinding('style') get display(): Partial<CSSStyleDeclaration> {
    return {
      visibility: this.showMenu ? 'visible' : 'hidden',
      opacity: this.showMenu ? '1' : '0',
      top: `${this.posTop}px`,
      left: `${this.posLeft}px`,
    };
  }

  /**
   * Gets the current view (`view: EditorView`).
   * @zh 获取当前视图（`view: EditorView`）。
   */
  private get view(): EditorView {
    return this.editor.view;
  }

  /**
   * Input property `editor` (`Editor`) configuring editor.
   * @zh 输入属性 `editor`（类型：`Editor`），用于配置编辑器。
   */
  @Input() editor: Editor;
  /**
   * Input property `autoPlace` (`boolean`) configuring auto place (default: `false`).
   * @zh 输入属性 `autoPlace`（类型：`boolean`），用于配置自动Place（默认值：`false`）。
   */
  @Input() autoPlace = false;

  /**
   * Property `posLeft` (`number`) storing pos left (default: `0`).
   * @zh 属性 `posLeft`（类型：`number`），用于存储或配置位置左侧位置（默认值：`0`）。
   */
  private posLeft = 0;
  /**
   * Property `posTop` (`number`) storing pos top (default: `0`).
   * @zh 属性 `posTop`（类型：`number`），用于存储或配置位置顶部位置（默认值：`0`）。
   */
  private posTop = 0;
  /**
   * Property `showMenu` (`boolean`) storing show menu (default: `false`).
   * @zh 属性 `showMenu`（类型：`boolean`），用于存储或配置显示菜单（默认值：`false`）。
   */
  private showMenu = false;
  /**
   * Property `updateSubscription` (`Subscription`) storing update subscription.
   * @zh 属性 `updateSubscription`（类型：`Subscription`），用于存储或配置更新订阅对象。
   */
  private updateSubscription: Subscription;
  /**
   * Property `dragging` (`boolean`) storing dragging (default: `false`).
   * @zh 属性 `dragging`（类型：`boolean`），用于存储或配置拖拽中（默认值：`false`）。
   */
  private dragging = false;
  /**
   * Property `resizeSubscription` (`Subscription`) storing resize subscription.
   * @zh 属性 `resizeSubscription`（类型：`Subscription`），用于存储或配置调整尺寸订阅对象。
   */
  private resizeSubscription: Subscription;

  /**
   * Host event listener `onMouseDown` handling `document:mousedown` events for on mouse down.
   * @zh 宿主事件监听方法 `onMouseDown`，响应 `document:mousedown` 事件以处理当鼠标向下。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  @HostListener('document:mousedown', ['$event']) onMouseDown(e: MouseEvent): void {
    const target = e.target as Node;

    if (this.el.nativeElement.contains(target) && target.nodeName !== 'INPUT') {
      e.preventDefault();
      return;
    }

    this.dragging = true;
  }

  /**
   * Host event listener `onKeyDown` handling `document:keydown` events for on key down.
   * @zh 宿主事件监听方法 `onKeyDown`，响应 `document:keydown` 事件以处理当键向下。
   * @param e - e parameter (`KeyboardEvent`) / e参数（`KeyboardEvent`）
   */
  @HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    const target = e.target as Node;
    if (target.nodeName === 'INPUT') {
      return;
    }
    this.dragging = true;
    this.hide();
  }

  /**
   * Host event listener `onMouseUp` handling `document:mouseup` events for on mouse up.
   * @zh 宿主事件监听方法 `onMouseUp`，响应 `document:mouseup` 事件以处理当鼠标向上。
   * @param e - e parameter (`MouseEvent`) / e参数（`MouseEvent`）
   */
  @HostListener('document:mouseup', ['$event']) onMouseUp(e: MouseEvent): void {
    const target = e.target as Node;

    if (this.el.nativeElement.contains(target) || target.nodeName === 'INPUT') {
      e.preventDefault();
      return;
    }

    this.dragging = false;
    this.useUpdate();
  }

  /**
   * Host event listener `onKeyUp` handling `document:keyup` events for on key up.
   * @zh 宿主事件监听方法 `onKeyUp`，响应 `document:keyup` 事件以处理当键向上。
   * @param e - e parameter (`KeyboardEvent`) / e参数（`KeyboardEvent`）
   */
  @HostListener('document:keyup', ['$event']) onKeyUp(e: KeyboardEvent): void {
    const target = e.target as Node;

    if (target.nodeName === 'INPUT') {
      return;
    }

    this.dragging = false;
    this.useUpdate();
  }

  /**
   * Executes `useUpdate` to handle use update.
   * @zh 执行 `useUpdate`，用于使用更新。
   */
  private useUpdate(): void {
    if (!this.view) {
      return;
    }

    this.update(this.view);
  }

  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   */
  private hide(): void {
    this.showMenu = false;
  }

  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   */
  private show(): void {
    this.showMenu = true;
  }

  /**
   * Executes `calculateBubblePosition` to handle calculate bubble position.
   * @zh 执行 `calculateBubblePosition`，用于计算Bubble位置。
   * @param view - view parameter (`EditorView`) / 视图参数（`EditorView`）
   * @returns Result of type `Promise<BubblePosition>` / 类型为 `Promise<BubblePosition>` 的返回值
   */
  private async calculateBubblePosition(view: EditorView): Promise<BubblePosition> {
    const { state: { selection } } = view;
    const { from, to } = selection;

    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    const selectionElement: VirtualElement = {
      getBoundingClientRect() {
        if (selection instanceof NodeSelection) {
          const node = view.nodeDOM(from) as HTMLElement;
          return node.getBoundingClientRect();
        }

        const { top, left } = start;
        const { bottom, right } = end;

        return {
          x: left,
          y: top,
          top,
          bottom,
          left,
          right,
          width: right - left,
          height: bottom - top,
        };
      },
    };

    // the floating bubble itself
    const bubbleEl = this.el.nativeElement;

    const { x: left, y: top } = await computePosition(selectionElement, bubbleEl, {
      placement: 'top',
      middleware: [
        offset(5),
        this.autoPlace && autoPlacement({
          boundary: view.dom,
          padding: 5,
          allowedPlacements: ['top', 'bottom'],
        }),
        {
          // prevent overflow on right and left side
          // since only top and bottom placements are allowed
          // autoplacement can't handle overflows on the right and left
          name: 'overflowMiddleware',
          async fn(middlewareArgs) {
            const overflow = await detectOverflow(middlewareArgs, {
              boundary: view.dom,
              padding: 5,
            });

            // overflows left
            if (overflow.left > 0) {
              return {
                x: middlewareArgs.x + overflow.left,
              };
            }

            // overflows right
            if (overflow.right > 0) {
              return {
                x: middlewareArgs.x - overflow.right,
              };
            }

            return {};
          },
        },
      ].filter(Boolean),
    });

    return {
      left,
      top,
    };
  }

  /**
   * Executes `canShowMenu` to handle can show menu.
   * @zh 执行 `canShowMenu`，用于是否可以显示菜单。
   * @param view - view parameter (`EditorView`) / 视图参数（`EditorView`）
   * @returns Result of type `Boolean` / 类型为 `Boolean` 的返回值
   */
  private canShowMenu(view: EditorView): Boolean {
    const { state } = view;
    const { selection } = state;
    const { empty } = selection;

    if (selection instanceof NodeSelection) {
      if (selection.node.type.name === 'image') {
        return false;
      }
    }

    const hasFocus = this.view.hasFocus();

    if (!hasFocus || empty || this.dragging) {
      this.hide();
      return false;
    }

    return true;
  }

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   * @param view - view parameter (`EditorView`) / 视图参数（`EditorView`）
   */
  private update(view: EditorView): void {
    const canShowMenu = this.canShowMenu(view);

    if (!canShowMenu) {
      this.hide();
      return;
    }

    this.calculateBubblePosition(this.view).then(({ top, left }) => {
      if (!this.canShowMenu(view)) {
        this.hide();
        return;
      }

      this.posLeft = left;
      this.posTop = top;

      this.show();
    });
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (!this.editor) {
      throw new EditorError('Required editor instance to initialize floating menu component');
    }

    this.updateSubscription = this.editor.update
      .subscribe((view) => {
        this.update(view);
      });

    this.resizeSubscription = fromEvent(window, 'resize').pipe(
      throttleTime(500, asyncScheduler, { leading: true, trailing: true }),
    ).subscribe(() => {
      this.useUpdate();
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }
}
