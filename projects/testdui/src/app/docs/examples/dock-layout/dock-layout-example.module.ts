/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/dock-layout/dock-layout-example.module.ts` providing dock layout example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/dock-layout/dock-layout-example.module.ts`，提供停靠面板布局example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ComponentFactoryResolver, Component, NgModule, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dui } from '@dotos/dui/core';
import { DockLayoutModule, DockLayoutHostComponent } from '@dotos/dui/container/dock-layout';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `DockWidgetComponent` (selector: 'app-dock-widget') providing dock widget component presentation and interaction in `projects/testdui/src/app/docs/examples/dock-layout`.
 * @zh Angular 组件 `DockWidgetComponent`（selector: 'app-dock-widget'），提供停靠面板小部件组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/dock-layout`）。
 */
@Component({
  selector: 'app-dock-widget',
  template: `<div style="padding:12px;">停靠面板内容：{{ label }}</div>`,
})
export class DockWidgetComponent {
  /**
   * Property `label` (`string`) storing label (default: `'Widget'`).
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签（默认值：`'Widget'`）。
   */
  label = 'Widget';
}

/**
 * Angular component `DockLayoutExampleComponent` (selector: 'app-dock-layout-example') providing dock layout example component presentation and interaction in `projects/testdui/src/app/docs/examples/dock-layout`.
 * @zh Angular 组件 `DockLayoutExampleComponent`（selector: 'app-dock-layout-example'），提供停靠面板布局Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/dock-layout`）。
 */
@Component({
  selector: 'app-dock-layout-example',
  template: `
    <h2>停靠布局示例</h2>
    <dock-layout-host #host style="display:block; width:100%; height:360px;"></dock-layout-host>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class DockLayoutExampleComponent implements AfterViewInit {
  /**
   * Template/content query reference `host` (`@ViewChild`) targeting host.
   * @zh 模板/内容视图查询引用 `host`（`@ViewChild`），指向宿主。
   */
  @ViewChild('host') host!: DockLayoutHostComponent;

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dock-layout-host #host></dock-layout-host>

@ViewChild('host') host!: DockLayoutHostComponent;

ngAfterViewInit(): void {
  this.host.dockLayout.loadLayout({
    root: {
      type: 'row',
      content: [
        { type: 'component', title: '左侧面板', componentType: { xtype: 'app-dock-widget' } },
        { type: 'component', title: '右侧面板', componentType: { xtype: 'app-dock-widget' } },
      ],
    },
  });
}`;

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    this.host.dockLayout.loadLayout({
      root: {
        type: 'row',
        content: [
          { type: 'component', title: '左侧面板', componentType: { xtype: 'app-dock-widget' } },
          { type: 'component', title: '右侧面板', componentType: { xtype: 'app-dock-widget' } },
        ],
      },
    } as any);
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/dock-layout`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/dock-layout` 中的routes。
 */
const routes: Routes = [{ path: '', component: DockLayoutExampleComponent }];

/**
 * Angular module `DockLayoutExampleModule` declaring and exporting dock layout example module components, directives, pipes, and providers.
 * @zh Angular 模块 `DockLayoutExampleModule`，声明并导出停靠面板布局Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [DockLayoutExampleComponent, DockWidgetComponent],
  imports: [CommonModule, DockLayoutModule.forRoot(), HighlightModule, RouterModule.forChild(routes)],
})
export class DockLayoutExampleModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[DockWidgetComponent]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[DockWidgetComponent]`）。
   */
  entryComponents = [DockWidgetComponent];
  /**
   * Creates an instance of `DockLayoutExampleModule` and initializes its dependencies and internal state.
   * @zh 创建 `DockLayoutExampleModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver, this.entryComponents);
  }
}
