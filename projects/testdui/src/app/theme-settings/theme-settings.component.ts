/**
 * @fileoverview Module `projects/testdui/src/app/theme-settings/theme-settings.component.ts` providing theme settings component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/theme-settings/theme-settings.component.ts`，提供主题设置项组件相关的定义与实现。
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DotosConfigService, ThemeService } from '@dotos1/dui/theme';

/**
 * Interface `SelectOption` defining the contract and properties for select option.
 * @zh 接口 `SelectOption`，定义下拉选择选项的数据结构契约与属性规范。
 */
interface SelectOption {
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
}

/**
 * Angular component `ThemeSettingsComponent` (selector: 'app-theme-settings') providing theme settings component presentation and interaction in `projects/testdui/src/app/theme-settings`.
 * @zh Angular 组件 `ThemeSettingsComponent`（selector: 'app-theme-settings'），提供主题设置项组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/theme-settings`）。
 */
@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ThemeSettingsComponent implements OnInit, OnDestroy {
  /**
   * Output event emitter `closed` (`EventEmitter`) firing when closed occurs.
   * @zh 输出事件 `closed`（类型：`EventEmitter`），当触发是否关闭时向外发出事件。
   */
  @Output() closed = new EventEmitter<void>();

  /**
   * Property `form` (`FormGroup`) storing form.
   * @zh 属性 `form`（类型：`FormGroup`），用于存储或配置表单。
   */
  readonly form: FormGroup;

  /**
   * Property `themeTypes` (`SelectOption[]`) storing theme types.
   * @zh 属性 `themeTypes`（类型：`SelectOption[]`），用于存储或配置主题类型列表。
   */
  readonly themeTypes: SelectOption[] = [
    { value: 'light', label: '浅色 Light' },
    { value: 'dark', label: '深色 Dark' },
    { value: 'darkblue', label: '深蓝 Dark Blue' },
  ];

  /**
   * Property `formTypes` (`SelectOption[]`) storing form types.
   * @zh 属性 `formTypes`（类型：`SelectOption[]`），用于存储或配置表单类型列表。
   */
  readonly formTypes: SelectOption[] = [
    { value: 'fill', label: '填充 Fill' },
    { value: 'outline', label: '描边 Outline' },
  ];

  /**
   * Property `destroy$` (`Subject`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Creates an instance of `ThemeSettingsComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ThemeSettingsComponent` 实例，并初始化其依赖项与内部状态。
   * @param fb - Injected or initial fb (`FormBuilder`) / 注入或传入的fb（`FormBuilder`）
   * @param dotosConfigService - Injected or initial dotos config service (`DotosConfigService`) / 注入或传入的DotOS配置服务（`DotosConfigService`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   */
  constructor(
    fb: FormBuilder,
    private dotosConfigService: DotosConfigService,
    public themeService: ThemeService
  ) {
    this.form = fb.group({
      type: ['light'],
      primary: ['blue-500'],
      accent: ['orange-500'],
      warn: ['red-800'],
      formType: ['fill'],
    });
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.dotosConfigService.config.pipe(takeUntil(this.destroy$)).subscribe((config: any) => {
      this.form.patchValue(config.theme, { emitEvent: false });
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.dotosConfigService.config = { theme };
    });
  }

  /**
   * Executes `reset` to handle reset.
   * @zh 执行 `reset`，用于重置。
   */
  reset(): void {
    this.dotosConfigService.resetToDefaults();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
