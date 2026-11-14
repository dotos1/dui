/**
 * @fileoverview Module `src/data/cardview/components/card-view-textitem/card-view-textitem.component.ts` providing card view textitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-textitem/card-view-textitem.component.ts`，提供卡片视图textitem组件相关的定义与实现。
 */


import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslateService } from '@dotos/dui/translator';
import { ClipboardService } from '@dotos/dui/common/clipboard';

import { CardViewTextItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { ThemeService } from '@dotos/dui/theme';



/**
 * Constant/variable `DEFAULT_SEPARATOR` defining default separator in `src/data/cardview/components/card-view-textitem`.
 * @zh 常量/变量 `DEFAULT_SEPARATOR`，定义 `src/data/cardview/components/card-view-textitem` 中的默认SEPARATOR。
 */
export const DEFAULT_SEPARATOR = ', ';
/**
 * Constant/variable `templateTypes` defining template types in `src/data/cardview/components/card-view-textitem`.
 * @zh 常量/变量 `templateTypes`，定义 `src/data/cardview/components/card-view-textitem` 中的模板类型列表。
 */
const templateTypes = {
  clickableTemplate: 'clickableTemplate',
  multilineTemplate: 'multilineTemplate',
  chipsTemplate: 'chipsTemplate',
  emptyTemplate: 'emptyTemplate',
  defaultTemplate: 'defaultTemplate'
};

/**
 * Angular component `CardViewTextItemComponent` (selector: 'dui-card-view-textitem') providing card view text item component presentation and interaction in `src/data/cardview/components/card-view-textitem`.
 * @zh Angular 组件 `CardViewTextItemComponent`（selector: 'dui-card-view-textitem'），提供卡片视图文本条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-textitem`）。
 */
@Component({
  selector: 'dui-card-view-textitem',
  templateUrl: './card-view-textitem.component.html',
  styleUrls: ['./card-view-textitem.component.scss'],
  standalone: false
})
export class CardViewTextItemComponent  implements OnChanges,OnDestroy {

  /**
   * Input property `property` (`CardViewTextItemModel`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewTextItemModel`），用于配置属性。
   */
  @Input()
  property: CardViewTextItemModel;

  /**
   * Input property `editable` (`boolean`) configuring editable (default: `false`).
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑（默认值：`false`）。
   */
  @Input()
  editable: boolean = false;

  /**
   * Input property `displayEmpty` (`boolean`) configuring display empty (default: `true`).
   * @zh 输入属性 `displayEmpty`（类型：`boolean`），用于配置display空（默认值：`true`）。
   */
  @Input()
  displayEmpty: boolean = true;

  /**
   * Input property `copyToClipboardAction` (`boolean`) configuring copy to clipboard action (default: `true`).
   * @zh 输入属性 `copyToClipboardAction`（类型：`boolean`），用于配置复制转换为Clipboard动作（默认值：`true`）。
   */
  @Input()
  copyToClipboardAction: boolean = true;

  /**
   * Input property `useChipsForMultiValueProperty` (`boolean`) configuring use chips for multi value property (default: `true`).
   * @zh 输入属性 `useChipsForMultiValueProperty`（类型：`boolean`），用于配置使用纸片标签用于多值属性（默认值：`true`）。
   */
  @Input()
  useChipsForMultiValueProperty: boolean = true;

  /**
   * Input property `multiValueSeparator` (`string`) configuring multi value separator (default: `DEFAULT_SEPARATOR`).
   * @zh 输入属性 `multiValueSeparator`（类型：`string`），用于配置多值Separator（默认值：`DEFAULT_SEPARATOR`）。
   */
  @Input()
  multiValueSeparator: string = DEFAULT_SEPARATOR;

  /**
   * Property `editedValue` (`string | string[]`) storing edited value.
   * @zh 属性 `editedValue`（类型：`string | string[]`），用于存储或配置已编辑值。
   */
  editedValue: string | string[];
  /**
   * Property `errorMessages` (`string[]`) storing error messages.
   * @zh 属性 `errorMessages`（类型：`string[]`），用于存储或配置错误消息列表。
   */
  errorMessages: string[];
  /**
   * Property `templateType` (`string`) storing template type.
   * @zh 属性 `templateType`（类型：`string`），用于存储或配置模板类型。
   */
  templateType: string;


  /**
   * Property `destroy$` (`Subject<boolean>`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject<boolean>`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();


  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Creates an instance of `CardViewTextItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewTextItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param clipboardService - Injected or initial clipboard service (`ClipboardService`) / 注入或传入的clipboard服务（`ClipboardService`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(
    public cardViewUpdateService: CardViewUpdateService,
    public themeService: ThemeService,
    private clipboardService: ClipboardService,
    private translateService: TranslateService) {
      this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewTextItemModel) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges(): void {
    this.resetValue();
    this.setTemplateType();
  }

  /**
   * Executes `setTemplateType` to handle set template type.
   * @zh 执行 `setTemplateType`，用于集合模板类型。
   */
  private setTemplateType() {
    if (this.showProperty || this.isEditable) {
      if (this.isClickable) {
        this.templateType = templateTypes.clickableTemplate;
      } else if (this.isChipViewEnabled) {
        this.templateType = templateTypes.chipsTemplate;
      } else {
        this.templateType = templateTypes.defaultTemplate;
      }
    } else {
      this.templateType = templateTypes.emptyTemplate;
    }
  }

  /**
   * Executes `resetValue` to handle reset value.
   * @zh 执行 `resetValue`，用于重置值。
   */
  resetValue() {
    if (this.isChipViewEnabled) {
      this.editedValue = this.property.value ? Array.from(this.property.value) : [];
    } else {
      this.editedValue = this.property.displayValue;
    }
  }

  /**
   * Executes `resetErrorMessages` to handle reset error messages.
   * @zh 执行 `resetErrorMessages`，用于重置错误消息列表。
   */
  private resetErrorMessages() {
    this.errorMessages = [];
  }

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   */
  update(): void {
    if (this.property.isValid(this.editedValue)) {
      const updatedValue = this.prepareValueForUpload(this.property, this.editedValue);
      this.cardViewUpdateService.update(<CardViewTextItemModel>{ ...this.property }, updatedValue);
      this.property.value = updatedValue;
      this.resetErrorMessages();
    } else {
      this.errorMessages = this.property.getValidationErrors(this.editedValue);
    }
  }

  /**
   * Executes `prepareValueForUpload` to handle prepare value for upload.
   * @zh 执行 `prepareValueForUpload`，用于prepare值用于上传。
   * @param property - property parameter (`CardViewTextItemModel`) / 属性参数（`CardViewTextItemModel`）
   * @param value - value parameter (`string | string[]`) / 值参数（`string | string[]`）
   * @returns Result of type `string | string[]` / 类型为 `string | string[]` 的返回值
   */
  prepareValueForUpload(property: CardViewTextItemModel, value: string | string[]): string | string[] {
    if (property.multivalued && typeof value === 'string') {
      const listOfValues = value.split(this.multiValueSeparator.trim()).map((item) => item.trim());
      return listOfValues;
    }
    return value;
  }

  /**
   * Executes `removeValueFromList` to handle remove value from list.
   * @zh 执行 `removeValueFromList`，用于移除值从列表。
   * @param itemIndex - item index parameter (`number`) / 条目索引参数（`number`）
   */
  removeValueFromList(itemIndex: number) {
    if (typeof this.editedValue !== 'string') {
      this.editedValue.splice(itemIndex, 1);
      this.update();
    }
  }

  /**
   * Executes `addValueToList` to handle add value to list.
   * @zh 执行 `addValueToList`，用于添加值转换为列表。
   * @param newListItem - new list item parameter (`MatChipInputEvent`) / 新列表条目参数（`MatChipInputEvent`）
   */
  addValueToList(newListItem: MatChipInputEvent) {
    const chipInput = newListItem.input;
    const chipValue = newListItem.value.trim() || '';

    if (typeof this.editedValue !== 'string') {
      if (chipValue) {
        this.editedValue.push(chipValue);
        this.update();
      }

      if (chipInput) {
        chipInput.value = '';
      }
    }
  }

  /**
   * Executes `clicked` to handle clicked.
   * @zh 执行 `clicked`，用于点击。
   */
  clicked(): void {
    if (typeof this.property.clickCallBack === 'function') {
      this.property.clickCallBack();
    } else {
      this.cardViewUpdateService.clicked(this.property);
    }
  }

  /**
   * Executes `clearValue` to handle clear value.
   * @zh 执行 `clearValue`，用于清空值。
   */
  clearValue() {
    this.editedValue = '';
  }

  /**
   * Executes `copyToClipboard` to handle copy to clipboard.
   * @zh 执行 `copyToClipboard`，用于复制转换为Clipboard。
   * @param valueToCopy - value to copy parameter (`string`) / 值转换为复制参数（`string`）
   */
  copyToClipboard(valueToCopy: string) {
    if (this.copyToClipboardAction) {
      const clipboardMessage = this.translateService.instant('METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
      this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
    }
  }

  /**
   * Gets the current show property (`showProperty: boolean`).
   * @zh 获取当前显示属性（`showProperty: boolean`）。
   */
  get showProperty(): boolean {
    return this.displayEmpty || !this.property.isEmpty();
  }

  /**
   * Gets the current show clickable icon (`showClickableIcon: boolean`).
   * @zh 获取当前显示是否可点击图标（`showClickableIcon: boolean`）。
   */
  get showClickableIcon(): boolean {
    return this.hasIcon && this.editable;
  }

  /**
   * Gets the current is editable (`isEditable: boolean`).
   * @zh 获取当前是否为是否可编辑（`isEditable: boolean`）。
   */
  get isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  /**
   * Gets the current is clickable (`isClickable: boolean`).
   * @zh 获取当前是否为是否可点击（`isClickable: boolean`）。
   */
  get isClickable(): boolean {
    return this.property.clickable;
  }

  /**
   * Gets the current has icon (`hasIcon: boolean`).
   * @zh 获取当前是否包含图标（`hasIcon: boolean`）。
   */
  get hasIcon(): boolean {
    return !!this.property.icon;
  }

  /**
   * Gets the current has errors (`hasErrors: boolean`).
   * @zh 获取当前是否包含错误列表（`hasErrors: boolean`）。
   */
  get hasErrors(): boolean {
    return this.errorMessages && this.errorMessages.length > 0;
  }

  /**
   * Gets the current is chip view enabled (`isChipViewEnabled: boolean`).
   * @zh 获取当前是否为纸片标签视图已启用（`isChipViewEnabled: boolean`）。
   */
  get isChipViewEnabled(): boolean {
    return this.property.multivalued && this.useChipsForMultiValueProperty;
  }
}
