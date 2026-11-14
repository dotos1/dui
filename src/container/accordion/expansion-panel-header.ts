/**
 * @fileoverview Module `src/container/accordion/expansion-panel-header.ts` providing expansion panel header definitions and implementation.
 * @zh 模块文件 `src/container/accordion/expansion-panel-header.ts`，提供展开面板面板表头相关的定义与实现。
 */


import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Host,
  Inject,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { merge } from 'rxjs';
import { Subscription } from 'rxjs';
import { DUI_EXPANSION_PANEL, EXPANSION_PANEL_ANIMATION_TIMING } from './expansion-panel-tokens';
import type { ExpansionPanel } from './expansion-panel';

/**
 * Angular component `ExpansionPanelHeader` (selector: 'expansion-panel-header') providing expansion panel header presentation and interaction in `src/container/accordion`.
 * @zh Angular 组件 `ExpansionPanelHeader`（selector: 'expansion-panel-header'），提供展开面板面板表头的视图渲染与交互逻辑（位于 `src/container/accordion`）。
 */
@Component({
  selector: 'expansion-panel-header',
  styleUrls: ['./expansion-panel-header.scss'],
  templateUrl: './expansion-panel-header.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
     hostID: 'dui-expansion-panel-header' + Math.random().toString(36).substring(2, 15),
    'class': 'expansion-panel-header',
    'role': 'button',
    '[attr.tabindex]': 'panel.disabled ? -1 : 0',
    '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'panel.disabled',
    '[class.dui-expanded]': '_isExpanded()',
    '(click)': '_toggle()',
    '(keyup)': '_keyup($event)',
    '[style.height]': '_isExpanded() ? (expandedHeight || "48px") : (collapsedHeight || "48px")',
  },
  standalone: false,
})
export class ExpansionPanelHeader implements OnDestroy {
  /**
   * Property `_parentChangeSubscription` (`Subscription`) storing parent change subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_parentChangeSubscription`（类型：`Subscription`），用于存储或配置父级变更订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _parentChangeSubscription = Subscription.EMPTY;

  /**
   * Creates an instance of `ExpansionPanelHeader` and initializes its dependencies and internal state.
   * @zh 创建 `ExpansionPanelHeader` 实例，并初始化其依赖项与内部状态。
   * @param panel - Injected or initial panel (`ExpansionPanel`) / 注入或传入的面板（`ExpansionPanel`）
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param _focusMonitor - Injected or initial focus monitor (`FocusMonitor`) / 注入或传入的聚焦Monitor（`FocusMonitor`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    @Inject(DUI_EXPANSION_PANEL) @Host() public panel: ExpansionPanel,
    private _element: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef) {

    // Since the toggle state depends on an @Input on the panel, we
    // need to  subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
      panel.opened,
      panel.closed,
      panel._inputChanges.pipe(filter((changes:{ hideToggle?; disabled? }) => !!(changes.hideToggle || changes.disabled)))
    )
      .subscribe(() => this._changeDetectorRef.markForCheck());

    _focusMonitor.monitor(_element.nativeElement, false);
  }

  /**
   * Height of the header while the panel is expanded.
   * @zh 输入属性 `expandedHeight`（类型：`string`），用于配置已展开高度。
   */
  @Input() expandedHeight: string;

  /**
   * Height of the header while the panel is collapsed.
   * @zh 输入属性 `collapsedHeight`（类型：`string`），用于配置已折叠高度。
   */
  @Input() collapsedHeight: string;

  /**
   * Toggles the expanded state of the panel.
   * @zh 执行 `_toggle`，用于开关。
   */
  _toggle(): void {
    if (!this.panel.disabled) {
      this.panel.toggle();
    }
  }

  /**
   * Gets whether the panel is expanded.
   * @zh 执行 `_isExpanded`，用于是否为已展开。
   */
  _isExpanded(): boolean {
    return this.panel.expanded;
  }

  /**
   * Gets the expanded state string of the panel.
   * @zh 执行 `_getExpandedState`，用于获取已展开状态。
   */
  _getExpandedState(): string {
    return this.panel._getExpandedState();
  }

  /**
   * Gets the panel id.
   * @zh 执行 `_getPanelId`，用于获取面板唯一标识。
   */
  _getPanelId(): string {
    return this.panel.id;
  }

  /**
   * Gets whether the expand indicator should be shown.
   * @zh 执行 `_showToggle`，用于显示开关。
   */
  _showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /**
   * Handle keyup event calling to toggle() if appropriate.
   * @zh 执行 `_keyup`，用于按键抬起。
   */
  _keyup(event: KeyboardEvent) {
    switch (event.keyCode) {
      case SPACE:
      case ENTER:
        event.preventDefault();
        this._toggle();
        break;
      default:
        return;
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element.nativeElement);
  }
}

/**
 * <panel-description> directive.
 *
 * This direction is to be used inside of the ExpansionPanelHeader component.

 * @zh Angular 指令 `ExpansionPanelDescription`（selector: 'panel-description'），为宿主 DOM 元素附加展开面板面板描述行为。
 */
@Directive({
  selector: 'panel-description',
  host: {
    class: 'expansion-panel-header-description'
  },
  standalone: false
})
export class ExpansionPanelDescription { }

/**
 * <panel-title> directive.
 *
 * This direction is to be used inside of the ExpansionPanelHeader component.

 * @zh Angular 指令 `ExpansionPanelTitle`（selector: 'panel-title'），为宿主 DOM 元素附加展开面板面板标题行为。
 */
@Directive({
  selector: 'panel-title',
  host: {
    class: 'expansion-panel-header-title'
  },
  standalone: false
})
export class ExpansionPanelTitle { }
