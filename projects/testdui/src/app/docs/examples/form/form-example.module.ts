/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/form/form-example.module.ts` providing form example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/form/form-example.module.ts`，提供表单example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorFieldModule, FormModule, FormWrapperModule } from '@dotos/dui/form';
import { LoadingModule, LoadingService } from '@dotos/dui/common/loading';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `FormExampleComponent` (selector: 'app-form-example') providing form example component presentation and interaction in `projects/testdui/src/app/docs/examples/form`.
 * @zh Angular 组件 `FormExampleComponent`（selector: 'app-form-example'），提供表单Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/form`）。
 */
@Component({
  selector: 'app-form-example',
  template: `
    <h2>动态表单示例</h2>
    <dui-form [config]="formConfig" style="display:block; max-width:480px;"></dui-form>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormExampleComponent {
  /**
   * Property `formConfig` (`any`) storing form config.
   * @zh 属性 `formConfig`（类型：`any`），用于存储或配置表单配置。
   */
  formConfig = {
    items: [
      {
        xtype: 'select-field',
        name: 'level',
        label: '等级',
        wrappers: ['form-field'],
        options: [
          { value: 'low', label: '低' },
          { value: 'medium', label: '中' },
          { value: 'high', label: '高' },
        ],
        defaultValue: 'medium',
      },
      {
        xtype: 'color-picker-field',
        name: 'color',
        label: '颜色',
        colorType: 'sketch',
        wrappers: ['form-field'],
        defaultValue: '#2196F3',
      },
    ],
  };

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-form [config]="formConfig"></dui-form>

formConfig = {
  items: [
    { xtype: 'select-field', name: 'level', label: '等级', options: [...] },
    { xtype: 'color-picker-field', name: 'color', label: '颜色', colorType: 'sketch' },
  ],
};`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/form`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/form` 中的routes。
 */
const routes: Routes = [{ path: '', component: FormExampleComponent }];

/**
 * Angular module `FormExampleModule` declaring and exporting form example module components, directives, pipes, and providers.
 * @zh Angular 模块 `FormExampleModule`，声明并导出表单Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [FormExampleComponent],
  imports: [CommonModule, FormModule, FormWrapperModule, ColorFieldModule, LoadingModule, HighlightModule, RouterModule.forChild(routes)],
  providers: [LoadingService],
})
export class FormExampleModule {}
