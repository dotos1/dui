/**
 * @fileoverview Module `src/common/animations/collapse/collapse.animation.ts` providing collapse animation metadata.
 * @zh 模块文件 `src/common/animations/collapse/collapse.animation.ts`，提供折叠纯 CSS 动画描述元数据。
 */

import { DuiAnimationMetadata, IAnimationOptions } from '../common/interfaces';

/**
 * Interface `ICollapseAnimation` defining the contract and properties for collapse animation options.
 * @zh 接口 `ICollapseAnimation`，定义折叠动画配置选项的数据结构契约与属性规范。
 */
export interface ICollapseAnimation extends IAnimationOptions {
  /**
   * Property `easeOnClose` (`string`) storing ease on close.
   * @zh 属性 `easeOnClose`（类型：`string`），用于存储或配置收起缓动函数。
   */
  easeOnClose?: string;
  /**
   * Property `easeOnOpen` (`string`) storing ease on open.
   * @zh 属性 `easeOnOpen`（类型：`string`），用于存储或配置展开缓动函数。
   */
  easeOnOpen?: string;
}

/**
 * Pure CSS animation metadata `CollapseAnimation` for collapse transitions.
 * @zh 纯 CSS 动画描述元数据 `CollapseAnimation`，用于折叠过渡动画。
 */
export const CollapseAnimation: DuiAnimationMetadata = {
  name: 'duiCollapse',
  duration: 150,
  delay: 0,
  easing: 'ease-in-out',
  cssClass: 'dui-anim-collapse',
};
