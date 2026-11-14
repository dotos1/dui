/**
 * @fileoverview Module `src/data/cardview/components/card-view-selectitem/card-view-selectitem.component.ts` providing card view selectitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-selectitem/card-view-selectitem.component.ts`，提供卡片视图selectitem组件相关的定义与实现。
 */


import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewSelectItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { CardViewSelectItemOption } from '../../interfaces';
import { ThemeService } from '@dotos/dui/theme';

/**
 * Angular component `CardViewSelectItemComponent` (selector: 'dui-card-view-selectitem') providing card view select item component presentation and interaction in `src/data/cardview/components/card-view-selectitem`.
 * @zh Angular 组件 `CardViewSelectItemComponent`（selector: 'dui-card-view-selectitem'），提供卡片视图下拉选择条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-selectitem`）。
 */
@Component({
  selector: 'dui-card-view-selectitem',
  templateUrl: './card-view-selectitem.component.html',
  styleUrls: ['./card-view-selectitem.component.scss'],
  standalone: false
})
export class CardViewSelectItemComponent implements OnChanges,OnDestroy {

  /**
   * Input property `property` (`CardViewSelectItemModel<string>`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewSelectItemModel<string>`），用于配置属性。
   */
  @Input()
  property: CardViewSelectItemModel<string>;

  /**
   * Input property `editable` (`boolean`) configuring editable (default: `false`).
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑（默认值：`false`）。
   */
  @Input() editable: boolean = false;

  /**
   * Input property `options$` (`Observable<CardViewSelectItemOption<string>[]>`) configuring options.
   * @zh 输入属性 `options$`（类型：`Observable<CardViewSelectItemOption<string>[]>`），用于配置配置选项。
   */
  @Input() options$: Observable<CardViewSelectItemOption<string>[]>;

  /**
   * Input property `displayNoneOption` (`boolean`) configuring display none option (default: `true`).
   * @zh 输入属性 `displayNoneOption`（类型：`boolean`），用于配置display无选项（默认值：`true`）。
   */
  @Input()
  displayNoneOption: boolean = true;

  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;


  /**
   * Property `destroy$` (`Subject<boolean>`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject<boolean>`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();

  /**
   * Creates an instance of `CardViewSelectItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewSelectItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   */
  constructor(
    public themeService: ThemeService,
    protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewSelectItemModel<string>) => {
        if (this.property.key === itemModel.key) {
          this.property.value = itemModel.value;
        }
      });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   */
  ngOnChanges(): void {
    this.value = this.property.value;
  }

  /**
   * Executes `isEditable` to handle is editable.
   * @zh 执行 `isEditable`，用于是否为是否可编辑。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEditable(): boolean {
    return this.editable && this.property.editable;
  }

  /**
   * Executes `getOptions` to handle get options.
   * @zh 执行 `getOptions`，用于获取配置选项。
   * @returns Result of type `Observable<CardViewSelectItemOption<string>[]>` / 类型为 `Observable<CardViewSelectItemOption<string>[]>` 的返回值
   */
  getOptions(): Observable<CardViewSelectItemOption<string>[]> {
    return this.options$ || this.property.options$;
  }

  /**
   * Executes `onChange` to handle on change.
   * @zh 执行 `onChange`，用于当变更。
   * @param event - event parameter (`MatSelectChange<any>`) / 事件参数（`MatSelectChange<any>`）
   */
  onChange(event: MatSelectChange): void {
    const selectedOption = event.value !== undefined ? event.value : null;
    this.cardViewUpdateService.update(<CardViewSelectItemModel<string>>{ ...this.property }, selectedOption);
    this.property.value = selectedOption;
  }

  /**
   * Executes `showNoneOption` to handle show none option.
   * @zh 执行 `showNoneOption`，用于显示无选项。
   */
  showNoneOption() {
    return this.displayNoneOption;
  }

  /**
   * Executes `trackByOption` to handle track by option.
   * @zh 执行 `trackByOption`，用于跟踪按选项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param option - option parameter (`CardViewSelectItemOption<string>`) / 选项参数（`CardViewSelectItemOption<string>`）
   * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
   */
  trackByOption(index: number, option: CardViewSelectItemOption<string>) {
    return option ? option.key : index;
  }
}
