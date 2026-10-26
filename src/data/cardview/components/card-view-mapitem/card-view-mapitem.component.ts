/**
 * @fileoverview Module `src/data/cardview/components/card-view-mapitem/card-view-mapitem.component.ts` providing card view mapitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-mapitem/card-view-mapitem.component.ts`，提供卡片视图mapitem组件相关的定义与实现。
 */


import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';

/**
 * Angular component `CardViewMapItemComponent` (selector: 'dui-card-view-mapitem') providing card view map item component presentation and interaction in `src/data/cardview/components/card-view-mapitem`.
 * @zh Angular 组件 `CardViewMapItemComponent`（selector: 'dui-card-view-mapitem'），提供卡片视图映射表条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-mapitem`）。
 */
@Component({
  selector: 'dui-card-view-mapitem',
  templateUrl: './card-view-mapitem.component.html',
  styleUrls: ['./card-view-mapitem.component.scss']
})

export class CardViewMapItemComponent implements OnDestroy {
  /**
   * Input property `property` (`CardViewMapItemModel`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewMapItemModel`），用于配置属性。
   */
  @Input()
  property: CardViewMapItemModel;

  /**
   * Input property `displayEmpty` (`boolean`) configuring display empty (default: `true`).
   * @zh 输入属性 `displayEmpty`（类型：`boolean`），用于配置display空（默认值：`true`）。
   */
  @Input()
  displayEmpty: boolean = true;


  /**
   * Property `destroy$` (`Subject`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();

  /**
   * Creates an instance of `CardViewMapItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewMapItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   */
  constructor(protected cardViewUpdateService: CardViewUpdateService) {
    this.cardViewUpdateService.updateItem$
      .pipe(takeUntil(this.destroy$))
       //@ts-ignore
      .subscribe((itemModel: CardViewMapItemModel) => {
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
   * Executes `showProperty` to handle show property.
   * @zh 执行 `showProperty`，用于显示属性。
   */
  showProperty() {
    return this.displayEmpty || !this.property.isEmpty();
  }

  /**
   * Executes `isClickable` to handle is clickable.
   * @zh 执行 `isClickable`，用于是否为是否可点击。
   */
  isClickable() {
    return this.property.clickable;
  }

  /**
   * Executes `clicked` to handle clicked.
   * @zh 执行 `clicked`，用于点击。
   */
  clicked(): void {
    this.cardViewUpdateService.clicked(this.property);
  }
}
