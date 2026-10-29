/**
 * @fileoverview Module `src/core/overlay/overlay-state.ts` providing overlay state definitions and implementation.
 * @zh 模块文件 `src/core/overlay/overlay-state.ts`，提供浮层状态相关的定义与实现。
 */

import { PositionStrategy } from '@angular/cdk/overlay';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { LayoutDirection } from '../rtl';

/**
 * Class `OverlayState` encapsulating overlay state data structures and logic in `src/core/overlay`.
 * @zh 类 `OverlayState`，封装 `src/core/overlay` 中的浮层状态数据结构与处理逻辑。
 */
export class OverlayState {
  /**
   * Strategy with which to position the overlay.
   * @zh 属性 `positionStrategy`（类型：`PositionStrategy`），用于存储或配置位置策略。
   */
  positionStrategy: PositionStrategy;

  /**
   * Strategy to be used when handling scroll events while the overlay is open.
   * @zh 属性 `scrollStrategy`（类型：`ScrollStrategy`），用于存储或配置滚动策略。
   */
  scrollStrategy: ScrollStrategy;

  /**
   * Custom class to add to the overlay pane.
   * @zh 属性 `panelClass`（类型：`string`），用于存储或配置面板类名（默认值：`''`）。
   */
  panelClass: string = '';

  /**
   * Whether the overlay has a backdrop.
   * @zh 属性 `hasBackdrop`（类型：`boolean`），用于存储或配置是否包含背景遮罩（默认值：`false`）。
   */
  hasBackdrop: boolean = false;

  /**
   * Custom class to add to the backdrop
   * @zh 属性 `backdropClass`（类型：`string`），用于存储或配置背景遮罩类名（默认值：`'cdk-overlay-dark-backdrop'`）。
   */
  backdropClass: string = 'cdk-overlay-dark-backdrop';

  /**
   * The width of the overlay panel. If a number is provided, pixel units are assumed.
   * @zh 属性 `width`（类型：`string | number`），用于存储或配置宽度。
   */
  width: number | string;

  /**
   * The height of the overlay panel. If a number is provided, pixel units are assumed.
   * @zh 属性 `height`（类型：`string | number`），用于存储或配置高度。
   */
  height: number | string;

  /**
   * The min-width of the overlay panel. If a number is provided, pixel units are assumed.
   * @zh 属性 `minWidth`（类型：`string | number`），用于存储或配置最小值宽度。
   */
  minWidth: number | string;

  /**
   * The min-height of the overlay panel. If a number is provided, pixel units are assumed.
   * @zh 属性 `minHeight`（类型：`string | number`），用于存储或配置最小值高度。
   */
  minHeight: number | string;

  /**
   * The direction of the text in the overlay panel.
   * @zh 属性 `direction`（类型：`LayoutDirection`），用于存储或配置方向（默认值：`'ltr'`）。
   */
  direction: LayoutDirection = 'ltr';

}
