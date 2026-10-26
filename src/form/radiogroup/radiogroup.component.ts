/**
 * @fileoverview Module `src/form/radiogroup/radiogroup.component.ts` providing radiogroup component definitions and implementation.
 * @zh 模块文件 `src/form/radiogroup/radiogroup.component.ts`，提供radiogroup组件相关的定义与实现。
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatField } from '../base/mat.field';
import { MatRadioGroup } from '@angular/material/radio';
import { TranslateService} from '@dotos/dui/translator';
import { observe } from '@dotos/dui/core/form';

/**
 * Angular component `RadioGroupField` (selector: 'radio-group') providing radio group field presentation and interaction in `src/form/radiogroup`.
 * @zh Angular 组件 `RadioGroupField`（selector: 'radio-group'），提供单选框分组字段的视图渲染与交互逻辑（位于 `src/form/radiogroup`）。
 */
@Component({
  selector: 'radio-group',
  styleUrls: ['./radiogroup.component.scss'],
  templateUrl: './radiogroup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 
    hostID: 'radio-group-field' + Math.random().toString(36).substring(2, 15),
  },
})
export class RadioGroupField extends MatField implements AfterViewInit,OnDestroy{

  /**
   * Template/content query reference `radioGroup` (`@ViewChild`) targeting radio group.
   * @zh 模板/内容视图查询引用 `radioGroup`（`@ViewChild`），指向单选框分组。
   */
  @ViewChild(MatRadioGroup, { static: true }) radioGroup!: MatRadioGroup;
  /**
   * Property `defaultOptions` (`any`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`any`），用于存储或配置默认配置选项。
   */
  override defaultOptions = {
    hideFieldUnderline: true,
    floatLabel: 'always',
    options: [],
    tabindex: -1,
  };


  /**
   * Property `readOnly` (`boolean`) storing read only (default: `false`).
   * @zh 属性 `readOnly`（类型：`boolean`），用于存储或配置读取Only（默认值：`false`）。
   */
  public readOnly = false;

  /**
   * Property `focusObserver` (`ReturnType<typeof observe>`) storing focus observer.
   * @zh 属性 `focusObserver`（类型：`ReturnType<typeof observe>`），用于存储或配置聚焦观察者。
   */
  private focusObserver!: ReturnType<typeof observe>;

  /**
   * Creates an instance of `RadioGroupField` and initializes its dependencies and internal state.
   * @zh 创建 `RadioGroupField` 实例，并初始化其依赖项与内部状态。
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   */
  constructor(protected override translate: TranslateService) {
    super(translate);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.focusObserver = observe(this.field, ['focused'], ({ currentValue }) => {
      if (this.field.tabindex === -1 && currentValue && this.radioGroup._radios.length > 0) {
        setTimeout(() => {
          const radio = this.radioGroup.selected ? this.radioGroup.selected : this.radioGroup._radios.first;
          radio.focus();
        });
      }
    });
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  override init() {
    super.init();
    this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : this.translate.instant("FORM.LEASTSELECT")
  }

  /**
   * Executes `onContainerClick` to handle on container click.
   * @zh 执行 `onContainerClick`，用于当容器点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  override onContainerClick(event: MouseEvent): void {
    if (this.radioGroup._radios.length) {
      if (this.radioGroup.selected) {
        this.radioGroup.selected.focus();
      } else {
        this.radioGroup._radios.first.focus();
      }
    }
    super.onContainerClick(event);
  }

  /**
   * Executes `trackByOption` to handle track by option.
   * @zh 执行 `trackByOption`，用于track按选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param option - option parameter (`any`) / 选项参数（`any`）
   */
  trackByOption(index: number, option) {
    return option ? option.value : index;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    this.focusObserver && this.focusObserver.unsubscribe();
    super.ngOnDestroy();
  }
}
