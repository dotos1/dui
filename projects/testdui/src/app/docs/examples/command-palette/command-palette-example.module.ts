/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/command-palette/command-palette-example.module.ts` providing command palette example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/command-palette/command-palette-example.module.ts`，提供命令调色板example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandPaletteModule, CommandPaletteService } from '@dotos/dui/ux/command-palette';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `CommandPaletteExampleComponent` (selector: 'app-command-palette-example') providing command palette example component presentation and interaction in `projects/testdui/src/app/docs/examples/command-palette`.
 * @zh Angular 组件 `CommandPaletteExampleComponent`（selector: 'app-command-palette-example'），提供命令调色板Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/command-palette`）。
 */
@Component({
  selector: 'app-command-palette-example',
  template: `
    <h2>命令面板示例</h2>
    <p>按 <code>Ctrl/Cmd + K</code> 打开命令面板（Esc 关闭），试试搜索"新建文件"或"保存"。</p>
    <p style="margin-top:12px;">最近执行：{{ lastAction || '（尚未执行）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class CommandPaletteExampleComponent implements OnInit {
  /**
   * Property `lastAction` (`string`) storing last action (default: `''`).
   * @zh 属性 `lastAction`（类型：`string`），用于存储或配置末尾动作（默认值：`''`）。
   */
  lastAction = '';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `constructor(private cmdPalette: CommandPaletteService) {}

ngOnInit(): void {
  this.cmdPalette.init();
  this.cmdPalette.addGroups([
    {
      title: '操作',
      items: [
        { text: '新建文件', callback: () => this.newFile() },
        { text: '保存', callback: () => this.save() },
        { text: '打开 Angular 官网', href: 'https://angular.dev' },
      ],
    },
  ]);
}`;

  /**
   * Creates an instance of `CommandPaletteExampleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CommandPaletteExampleComponent` 实例，并初始化其依赖项与内部状态。
   * @param cmdPalette - Injected or initial cmd palette (`CommandPaletteService`) / 注入或传入的cmd调色板（`CommandPaletteService`）
   */
  constructor(private cmdPalette: CommandPaletteService) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.cmdPalette.init();
    this.cmdPalette.addGroups([
      {
        title: '操作',
        items: [
          { text: '新建文件', callback: () => (this.lastAction = '新建文件') },
          { text: '保存', callback: () => (this.lastAction = '保存') },
          { text: '打开 Angular 官网', href: 'https://angular.dev' },
        ],
      },
    ] as any);
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/command-palette`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/command-palette` 中的routes。
 */
const routes: Routes = [{ path: '', component: CommandPaletteExampleComponent }];

/**
 * Angular module `CommandPaletteExampleModule` declaring and exporting command palette example module components, directives, pipes, and providers.
 * @zh Angular 模块 `CommandPaletteExampleModule`，声明并导出命令调色板Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CommandPaletteExampleComponent],
  imports: [CommonModule, CommandPaletteModule, HighlightModule, RouterModule.forChild(routes)],
})
export class CommandPaletteExampleModule {}
