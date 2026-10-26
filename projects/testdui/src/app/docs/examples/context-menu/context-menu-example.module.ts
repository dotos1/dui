/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/context-menu/context-menu-example.module.ts` providing context menu example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/context-menu/context-menu-example.module.ts`，提供上下文菜单example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContextMenuModule, ContextMenuService } from '@dotos/dui/ui/context-menu';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `ContextMenuExampleComponent` (selector: 'app-context-menu-example') providing context menu example component presentation and interaction in `projects/testdui/src/app/docs/examples/context-menu`.
 * @zh Angular 组件 `ContextMenuExampleComponent`（selector: 'app-context-menu-example'），提供上下文菜单Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/context-menu`）。
 */
@Component({
  selector: 'app-context-menu-example',
  template: `
    <h2>右键菜单示例</h2>
    <div
      (contextmenu)="onContextMenu($event)"
      style="width:100%; height:160px; border:1px dashed rgba(0,0,0,.3); border-radius:4px; display:flex; align-items:center; justify-content:center;">
      在此区域内点击鼠标右键
    </div>
    <p style="margin-top:12px;">最近选择：{{ lastAction || '（尚未操作）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class ContextMenuExampleComponent {
  /**
   * Property `lastAction` (`string`) storing last action (default: `''`).
   * @zh 属性 `lastAction`（类型：`string`），用于存储或配置末尾动作（默认值：`''`）。
   */
  lastAction = '';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<div (contextmenu)="onContextMenu($event)">在此区域内点击鼠标右键</div>

constructor(private contextMenuService: ContextMenuService) {}

onContextMenu(event: MouseEvent): void {
  event.preventDefault();
  this.contextMenuService.open({
    source: event,
    children: [
      { title: '复制', handler: () => this.copy() },
      { title: '粘贴', handler: () => this.paste() },
      { type: 'divider' },
      { title: '删除', handler: () => this.remove() },
    ],
  });
}`;

  /**
   * Creates an instance of `ContextMenuExampleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuExampleComponent` 实例，并初始化其依赖项与内部状态。
   * @param contextMenuService - Injected or initial context menu service (`ContextMenuService`) / 注入或传入的上下文菜单服务（`ContextMenuService`）
   */
  constructor(private contextMenuService: ContextMenuService) {}

  /**
   * Executes `onContextMenu` to handle on context menu.
   * @zh 执行 `onContextMenu`，用于当上下文菜单。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuService.open({
      source: event,
      children: [
        { title: '复制', handler: () => (this.lastAction = '复制') } as any,
        { title: '粘贴', handler: () => (this.lastAction = '粘贴') } as any,
        { type: 'divider' } as any,
        { title: '删除', handler: () => (this.lastAction = '删除') } as any,
      ],
    });
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/context-menu`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/context-menu` 中的routes。
 */
const routes: Routes = [{ path: '', component: ContextMenuExampleComponent }];

/**
 * Angular module `ContextMenuExampleModule` declaring and exporting context menu example module components, directives, pipes, and providers.
 * @zh Angular 模块 `ContextMenuExampleModule`，声明并导出上下文菜单Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ContextMenuExampleComponent],
  imports: [CommonModule, ContextMenuModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ContextMenuExampleModule {}
