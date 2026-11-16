/**
 * @fileoverview Module `projects/testdui/src/app/focus-check/focus-check.module.ts` providing a minimal form-card host for focus/blur browser checks.
 * @zh 模块文件 `projects/testdui/src/app/focus-check/focus-check.module.ts`：最小 form-card 宿主页，供真浏览器「字段失焦后不再高亮」检查使用（`tools/m2-parity/focus-blur-check.mjs`）。
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingModule, LoadingService } from '@dotos1/dui/common/loading';
import { configFactory, ConfigLoader, ConfigService } from '@dotos1/dui/core/config';
import { LogService } from '@dotos1/dui/core/services';
import { CommonFieldModule, FormModule, FormWrapperModule, SelectFieldModule, SliderToggleFieldModule } from '@dotos1/dui/form';
import { FormCardModule } from '@dotos1/dui/form/card';
import { ThemeService } from '@dotos1/dui/theme';

/**
 * Angular component `FocusCheckComponent` rendering a form-card similar to the host menu panel.
 * @zh Angular 组件 `FocusCheckComponent`：仿宿主菜单编辑页（etc/menu）的 form-card，含文本、数字、选择、开关字段。
 */
@Component({
  selector: 'app-focus-check',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  template: '<form-card [config]="formConfig" data-focus-check="card"></form-card>',
})
export class FocusCheckComponent implements OnInit {
  /**
   * Creates an instance of `FocusCheckComponent`.
   * @zh 创建 `FocusCheckComponent` 实例。
   * @param themeService - Injected theme service (`ThemeService`) / 注入的主题服务（`ThemeService`）
   */
  constructor(private themeService: ThemeService) {}

  /**
   * Angular lifecycle hook: applies `?formType=fill|outline` from the URL.
   * @zh Angular 生命周期钩子：按地址参数 `?formType=fill|outline` 切换表单外观（填充 / 轮廓）。
   */
  ngOnInit(): void {
    const formType = new URLSearchParams(window.location.search).get('formType');
    if (formType === 'fill' || formType === 'outline') {
      this.themeService.formType.next(formType);
    }
  }

  /**
   * Property `formConfig` (`Record<string, unknown>`) storing form-card configuration.
   * @zh 属性 `formConfig`（类型：`Record<string, unknown>`），form-card 配置。
   */
  readonly formConfig: Record<string, unknown> = {
    xtype: 'form-card',
    value: {},
    items: [
      { xtype: 'text-field', label: 'Title', name: 'app_title', wrappers: ['form-field'], required: true, maxLength: 50 },
      { xtype: 'number-field', label: 'Seq', name: 'app_seq', wrappers: ['form-field'], min: 0, max: 100000, flex: 50, required: true },
      { xtype: 'text-field', label: 'Path', name: 'path', wrappers: ['form-field'], required: true },
      { xtype: 'text-field', label: 'Url', name: 'url', wrappers: ['form-field'] },
      {
        xtype: 'select-field', label: 'Kind', name: 'kind', wrappers: ['form-field'],
        options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }],
      },
      { xtype: 'slide-toggle', name: 'is_valid', defaultValue: true, flex: 25, labelPosition: 'before', label: 'Enable' },
    ],
  };
}

/**
 * Angular module `FocusCheckModule` declaring the focus-check host page.
 * @zh Angular 模块 `FocusCheckModule`，声明 `/focus-check` 宿主页。
 */
@NgModule({
  declarations: [FocusCheckComponent],
  imports: [
    CommonModule,
    LoadingModule,
    FormModule.forRoot(),
    FormWrapperModule,
    CommonFieldModule,
    SelectFieldModule,
    SliderToggleFieldModule,
    FormCardModule,
    RouterModule.forChild([{ path: '', component: FocusCheckComponent }]),
  ],
  providers: [
    LoadingService,
    { provide: ConfigLoader, useFactory: configFactory },
    ConfigService,
    LogService,
  ],
})
export class FocusCheckModule {}
