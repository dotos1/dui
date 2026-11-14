/**
 * @fileoverview Module `src/data/cardview/components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component.ts` providing card view keyvaluepairsitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component.ts`，提供卡片视图keyvaluepairsitem组件相关的定义与实现。
 */


import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewUpdateService } from '../../services';
import { CardViewKeyValuePairsItemModel } from '../../models';
import { CardViewKeyValuePairsItemType } from '../../interfaces';


/**
 * Angular component `CardViewKeyValuePairsItemComponent` (selector: 'dui-card-view-keyvaluepairsitem') providing card view key value pairs item component presentation and interaction in `src/data/cardview/components/card-view-keyvaluepairsitem`.
 * @zh Angular 组件 `CardViewKeyValuePairsItemComponent`（selector: 'dui-card-view-keyvaluepairsitem'），提供卡片视图键值Pairs条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-keyvaluepairsitem`）。
 */
@Component({
  selector: 'dui-card-view-keyvaluepairsitem',
  templateUrl: './card-view-keyvaluepairsitem.component.html',
  styleUrls: ['./card-view-keyvaluepairsitem.component.scss'],
  standalone: false
})

export class CardViewKeyValuePairsItemComponent  implements OnChanges,OnDestroy {

  /**
   * Input property `property` (`CardViewKeyValuePairsItemModel`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewKeyValuePairsItemModel`），用于配置属性。
   */
  @Input()
  property: CardViewKeyValuePairsItemModel;

  /**
   * Input property `editable` (`boolean`) configuring editable (default: `false`).
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑（默认值：`false`）。
   */
  @Input()
  editable: boolean = false;

  /**
   * Property `values` (`CardViewKeyValuePairsItemType[]`) storing values.
   * @zh 属性 `values`（类型：`CardViewKeyValuePairsItemType[]`），用于存储或配置值列表。
   */
  values: CardViewKeyValuePairsItemType[];
  /**
   * Property `matTableValues` (`MatTableDataSource<CardViewKeyValuePairsItemType, MatPaginator>`) storing mat table values.
   * @zh 属性 `matTableValues`（类型：`MatTableDataSource<CardViewKeyValuePairsItemType, MatPaginator>`），用于存储或配置Material表格值列表。
   */
  matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;


  /**
   * Property `destroy$` (`Subject<boolean>`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject<boolean>`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();

  /**
   * Creates an instance of `CardViewKeyValuePairsItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewKeyValuePairsItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   */
  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
      //@ts-ignore
      .subscribe((itemModel: CardViewKeyValuePairsItemModel) => {
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
  ngOnChanges() {
    this.values = this.property.value || [];
    this.matTableValues = new MatTableDataSource(this.values);
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
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   */
  add(): void {
    this.values.push({ name: '', value: '' });
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  remove(index: number): void {
    this.values.splice(index, 1);
    this.save(true);
  }

  /**
   * Executes `onBlur` to handle on blur.
   * @zh 执行 `onBlur`，用于当失焦。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  onBlur(value): void {
    if (value.length) {
      this.save();
    }
  }

  /**
   * Executes `save` to handle save.
   * @zh 执行 `save`，用于保存。
   * @param remove - remove parameter (`boolean`) / 移除参数（`boolean`）
   */
  save(remove?: boolean): void {
    const validValues = this.values.filter((i) => i.name.length && i.value.length);

    if (remove || validValues.length) {
      this.cardViewUpdateService.update(<CardViewKeyValuePairsItemModel>{ ...this.property }, validValues);
      this.property.value = validValues;
    }
  }

  /**
   * Executes `trackByIndex` to handle track by index.
   * @zh 执行 `trackByIndex`，用于跟踪按索引。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  trackByIndex(index: number): number {
    return index;
  }
}
