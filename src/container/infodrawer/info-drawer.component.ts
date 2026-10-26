/**
 * @fileoverview Module `src/container/infodrawer/info-drawer.component.ts` providing info drawer component definitions and implementation.
 * @zh 模块文件 `src/container/infodrawer/info-drawer.component.ts`，提供信息抽屉面板组件相关的定义与实现。
 */


import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
/**
 * Angular component `InfoDrawerTabComponent` (selector: 'dui-info-drawer-tab') providing info drawer tab component presentation and interaction in `src/container/infodrawer`.
 * @zh Angular 组件 `InfoDrawerTabComponent`（selector: 'dui-info-drawer-tab'），提供信息抽屉面板选项卡组件的视图渲染与交互逻辑（位于 `src/container/infodrawer`）。
 */
@Component({
  selector: 'dui-info-drawer-tab',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  host: {hostID: 'dui-info-drawer-tab' + Math.random().toString(36).substring(2, 15)},
})
export class InfoDrawerTabComponent {

  /**
   * Input property `label` (`string`) configuring label (default: `''`).
   * @zh 输入属性 `label`（类型：`string`），用于配置标签（默认值：`''`）。
   */
  @Input()
  label: string = '';

  /**
   * Input property `icon` (`string`) configuring icon (default: `null`).
   * @zh 输入属性 `icon`（类型：`string`），用于配置图标（默认值：`null`）。
   */
  @Input()
  icon: string = null;

  /**
   * Template/content query reference `content` (`@ViewChild`) targeting content.
   * @zh 模板/内容视图查询引用 `content`（`@ViewChild`），指向内容。
   */
  @ViewChild(TemplateRef)
  content: TemplateRef<unknown>;
}

/**
 * Angular component `InfoDrawerComponent` (selector: 'dui-info-drawer') providing info drawer component presentation and interaction in `src/container/infodrawer`.
 * @zh Angular 组件 `InfoDrawerComponent`（selector: 'dui-info-drawer'），提供信息抽屉面板组件的视图渲染与交互逻辑（位于 `src/container/infodrawer`）。
 */
@Component({
  selector: 'dui-info-drawer',
  templateUrl: './info-drawer.component.html',
  styleUrls: ['./info-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 
    'class': 'dui-info-drawer', 
    hostID: 'dui-info-drawer' + Math.random().toString(36).substring(2, 15)
   }
})
export class InfoDrawerComponent {
  /**
   * The title of the info drawer (string or translation key).
   * @zh 输入属性 `title`（类型：`string | null`），用于配置标题（默认值：`null`）。
   */
  @Input()
  title: string | null = null;

  /**
   * The selected index tab.
   * @zh 输入属性 `selectedIndex`（类型：`number`），用于配置已选中索引（默认值：`0`）。
   */
  @Input()
  selectedIndex: number = 0;

  /**
   * Emitted when the currently active tab changes.
   * @zh 输出事件 `currentTab`（类型：`EventEmitter<number>`），当触发当前选项卡时向外发出事件。
   */
  @Output()
  currentTab: EventEmitter<number> = new EventEmitter<number>();


  /**
   * Emitted when the currently active tab changes.
   * @zh 输出事件 `onClose`（类型：`EventEmitter<void>`），当触发当关闭时向外发出事件。
   */
  @Output()
  onClose: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Template/content query reference `contentBlocks` (`@ContentChildren`) targeting content blocks.
   * @zh 模板/内容视图查询引用 `contentBlocks`（`@ContentChildren`），指向内容块列表。
   */
  @ContentChildren(InfoDrawerTabComponent)
  contentBlocks: QueryList<InfoDrawerTabComponent>;

  /**
   * Executes `showTabLayout` to handle show tab layout.
   * @zh 执行 `showTabLayout`，用于显示选项卡布局。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  showTabLayout(): boolean {
    return this.contentBlocks.length > 0;
  }

  /**
   * Executes `onTabChange` to handle on tab change.
   * @zh 执行 `onTabChange`，用于当选项卡变更。
   * @param event - event parameter (`MatTabChangeEvent`) / 事件参数（`MatTabChangeEvent`）
   */
  onTabChange(event: MatTabChangeEvent) {
    this.currentTab.emit(event.index);
  }
  /**
   * Executes `close` to handle close.
   * @zh 执行 `close`，用于关闭。
   */
  close() {
    this.onClose.emit();
  }
}
