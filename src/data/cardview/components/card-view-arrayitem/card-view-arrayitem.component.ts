/**
 * @fileoverview Module `src/data/cardview/components/card-view-arrayitem/card-view-arrayitem.component.ts` providing card view arrayitem component definitions and implementation.
 * @zh 模块文件 `src/data/cardview/components/card-view-arrayitem/card-view-arrayitem.component.ts`，提供卡片视图arrayitem组件相关的定义与实现。
 */


import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardViewArrayItemModel } from '../../models';
import { CardViewUpdateService } from '../../services';
import { ThemeService } from '@dotos1/dui/theme';
/**
 * Angular component `CardViewArrayItemComponent` (selector: 'dui-card-view-arrayitem') providing card view array item component presentation and interaction in `src/data/cardview/components/card-view-arrayitem`.
 * @zh Angular 组件 `CardViewArrayItemComponent`（selector: 'dui-card-view-arrayitem'），提供卡片视图数组条目组件的视图渲染与交互逻辑（位于 `src/data/cardview/components/card-view-arrayitem`）。
 */
@Component({
  selector: 'dui-card-view-arrayitem',
  templateUrl: './card-view-arrayitem.component.html',
  styleUrls: ['./card-view-arrayitem.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardViewArrayItemComponent  implements OnDestroy{

  /**
   * Input property `property` (`CardViewArrayItemModel`) configuring property.
   * @zh 输入属性 `property`（类型：`CardViewArrayItemModel`），用于配置属性。
   */
  @Input()
  property: CardViewArrayItemModel;


  /**
   * Property `destroy$` (`Subject<boolean>`) storing destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `destroy$`（类型：`Subject<boolean>`），用于存储或配置销毁（默认值：`new Subject<boolean>()`）。
   */
  protected destroy$ = new Subject<boolean>();

  /**
   * Creates an instance of `CardViewArrayItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewArrayItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param cardViewUpdateService - Injected or initial card view update service (`CardViewUpdateService`) / 注入或传入的卡片视图更新服务（`CardViewUpdateService`）
   * @param themeService - Injected or initial theme service (`ThemeService`) / 注入或传入的主题服务（`ThemeService`）
   */
  constructor(
    protected cardViewUpdateService: CardViewUpdateService,
    public themeService: ThemeService,
  ) {
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
   * Executes `clicked` to handle clicked.
   * @zh 执行 `clicked`，用于点击。
   */
  clicked(): void {
    if (this.isClickable()) {
      this.cardViewUpdateService.clicked(this.property);
    }
  }

  /**
   * Executes `showClickableIcon` to handle show clickable icon.
   * @zh 执行 `showClickableIcon`，用于显示是否可点击图标。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  showClickableIcon(): boolean {
    return this.hasIcon() && this.isClickable();
  }

  /**
   * Executes `hasIcon` to handle has icon.
   * @zh 执行 `hasIcon`，用于是否包含图标。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  hasIcon(): boolean {
    return !!this.property.icon;
  }

  /**
   * Executes `displayCount` to handle display count.
   * @zh 执行 `displayCount`，用于display计数。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  displayCount(): number {
    return this.property.noOfItemsToDisplay ? this.property.noOfItemsToDisplay : 0;
  }

  /**
   * Executes `isClickable` to handle is clickable.
   * @zh 执行 `isClickable`，用于是否为是否可点击。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isClickable(): boolean {
    return !!this.property.clickable;
  }

  /**
   * Executes `trackByItem` to handle track by item.
   * @zh 执行 `trackByItem`，用于跟踪按条目。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  trackByItem(index: number, item) {
    return item?.value ?? index;
  }
}
