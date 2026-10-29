/**
 * @fileoverview Module `src/core/dynamic/dynamic.component.ts` providing dynamic component definitions and implementation.
 * @zh 模块文件 `src/core/dynamic/dynamic.component.ts`，提供动态组件相关的定义与实现。
 */

import { ChangeDetectorRef, Component, ComponentRef, Input, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import {  inject, ViewContainerRef, ɵcompileComponent } from '@angular/core';
import { SafeurlPipe } from "./safeurl.pipe";

/**
 * Angular component `DynamicComponent` (selector: 'dui-dynamic') providing dynamic component presentation and interaction in `src/core/dynamic`.
 * @zh Angular 组件 `DynamicComponent`（selector: 'dui-dynamic'），提供动态组件的视图渲染与交互逻辑（位于 `src/core/dynamic`）。
 */
@Component({
  selector: "dui-dynamic",
  templateUrl: "./dynamic.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class DynamicComponent implements OnInit, OnDestroy {

  /**
   * Input property `tmpl` (`string`) configuring tmpl.
   * @zh 输入属性 `tmpl`（类型：`string`），用于配置tmpl。
   */
  @Input()
  tmpl: string;

  /**
   * Input property `data` (`any`) configuring data.
   * @zh 输入属性 `data`（类型：`any`），用于配置数据。
   */
  @Input()
  data;

  /**
   * Property `template` (`string`) storing template.
   * @zh 属性 `template`（类型：`string`），用于存储或配置模板。
   */
  template: string;

  /**
   * Property `viewRef` (`ViewContainerRef`) storing view ref (default: `inject(ViewContainerRef)`).
   * @zh 属性 `viewRef`（类型：`ViewContainerRef`），用于存储或配置视图引用（默认值：`inject(ViewContainerRef)`）。
   */
  viewRef = inject(ViewContainerRef);

  /**
   * Property `componentRef` (`any`) storing component ref.
   * @zh 属性 `componentRef`（类型：`any`），用于存储或配置组件引用。
   */
  private componentRef?;

  /**
   * Creates an instance of `DynamicComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DynamicComponent` 实例，并初始化其依赖项与内部状态。
   * @param safeUrl - Injected or initial safe url (`SafeurlPipe`) / 注入或传入的安全链接地址（`SafeurlPipe`）
   * @param detectChange - Injected or initial detect change (`ChangeDetectorRef`) / 注入或传入的检测变更（`ChangeDetectorRef`）
   */
  constructor(
    private safeUrl: SafeurlPipe,
    public detectChange: ChangeDetectorRef
  ) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    const safe = this.safeUrl.transform(this.tmpl, "html") as { changingThisBreaksApplicationSecurity?: string };
    this.template = safe.changingThisBreaksApplicationSecurity;
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    const component = getComponentFromTemplate(this.template);
    this.componentRef = this.viewRef.createComponent(component);
    this.componentRef.setInput('data', this.data);
    // 生产构建（ngDevMode=false）不跑 ɵsetClassMetadata，@Input 元数据没了；setInput 静默落空 —— 再直接赋一次
    this.componentRef.instance.data = this.data;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}

/**
 * Executes `getComponentFromTemplate` to handle get component from template.
 * @zh 执行 `getComponentFromTemplate`，用于获取组件从模板。
 * @param template - template parameter (`string`) / 模板参数（`string`）
 */
function getComponentFromTemplate(template: string) {
  @Component({
    template: '',
  })
  class CustomComponent {
    /**
     * Input property `data` (`Record<string, unknown>`) configuring data (default: `{}`).
     * @zh 输入属性 `data`（类型：`Record<string, unknown>`），用于配置数据（默认值：`{}`）。
     */
    @Input() data: Record<string, unknown> = {};
  }

  // inputs 要显式写：@Input() 装饰器的元数据只在开发模式下由 ɵsetClassMetadata 补上，生产构建里运行时编译的组件
  // 没有 data 输入，模板里 {{data.x}} 全是空（2026-10-22：平台看板卡片在生产构建里一片空白）
  ɵcompileComponent(CustomComponent, {
    template,
    standalone: true,
    imports: [CommonModule],
    inputs: ['data'],
  });
  return CustomComponent;
}