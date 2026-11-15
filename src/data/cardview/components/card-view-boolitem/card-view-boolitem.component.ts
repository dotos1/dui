/**
 * @fileoverview Module `src/data/cardview/components/card-view-boolitem/card-view-boolitem.component.ts` providing card view boolitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-boolitem/card-view-boolitem.component.ts`，提供卡片视图boolitem组件相关的定义与实现。
 */


import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewBoolItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';

/**
 * Angular component `CardViewBoolItemComponent` (selector: 'dui-card-view-boolitem') providing card view bool item component presentation and interaction in `src/data/cardview/components/card-view-boolitem`.
 * @zh Angular 组件 `CardViewBoolItemComponent`（selector: 'dui-card-view-boolitem'），提供卡片视图Bool条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-boolitem`）。
 */
@Component({
  selector: 'dui-card-view-boolitem',
  templateUrl: './card-view-boolitem.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})

export class CardViewBoolItemComponent implements OnDestroy {

  /**
   * Input property `property` (`CardViewBoolItemModel`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewBoolItemModel`），用于配置属性。
   */
  @Input()
  property: CardViewBoolItemModel;

  /**
   * Input property `editable` (`boolean`) configuring editable.
   * @zh 输入属性 `editable`（类型：`boolean`），用于配置是否可编辑。
   */
  @Input()
  editable: boolean;


  /**
   * Property `destroy$` (`Subject<boolean>`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject<boolean>`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();

  /**
   * Creates an instance of `CardViewBoolItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewBoolItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   */
  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemModel: { key?; value? }) => {
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
   * Executes `isEditable` to handle is editable.
   * @zh 执行 `isEditable`，用于是否为是否可编辑。
   */
  isEditable() {
    return this.editable && this.property.editable;
  }

  /**
   * Executes `changed` to handle changed.
   * @zh 执行 `changed`，用于已变更。
   * @param change - change parameter (`MatCheckboxChange`) / 变更参数（`MatCheckboxChange`）
   */
  changed(change: MatCheckboxChange) {
    this.cardViewUpdateService.update(<CardViewBoolItemModel>{ ...this.property }, change.checked);
    this.property.value = change.checked;
  }
}
