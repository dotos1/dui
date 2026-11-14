/**
 * @fileoverview Module `src/common/message/collapse.animation.ts` providing collapse animation metadata.
 * @zh 模块文件 `src/common/message/collapse.animation.ts`，提供消息组件纯 CSS 折叠动画描述元数据。
 */

/**
 * Interface `IAnimationOptions` defining the contract and properties for animation options.
 * @zh 接口 `IAnimationOptions`，定义动画配置选项的数据结构契约与属性规范。
 */
export interface IAnimationOptions {
  /**
   * Property `anchor` (`string`) storing anchor.
   * @zh 属性 `anchor`（类型：`string`），用于存储或配置锚点。
   */
  anchor?: string;
  /**
   * Property `duration` (`number`) storing duration.
   * @zh 属性 `duration`（类型：`number`），用于存储或配置持续时间。
   */
  duration?: number;
  /**
   * Property `delay` (`number`) storing delay.
   * @zh 属性 `delay`（类型：`number`），用于存储或配置延迟。
   */
  delay?: number;
}

/**
 * Interface `ICollapseAnimation` defining the contract and properties for collapse animation.
 * @zh 接口 `ICollapseAnimation`，定义折叠动画的数据结构契约与属性规范。
 */
export interface ICollapseAnimation extends IAnimationOptions {
  /**
   * Property `easeOnClose` (`string`) storing ease on close.
   * @zh 属性 `easeOnClose`（类型：`string`），用于存储或配置关闭缓动函数。
   */
  easeOnClose?: string;
  /**
   * Property `easeOnOpen` (`string`) storing ease on open.
   * @zh 属性 `easeOnOpen`（类型：`string`），用于存储或配置打开缓动函数。
   */
  easeOnOpen?: string;
}

/**
 * Pure CSS animation metadata `duiCollapseAnimation` for message collapse transitions.
 * @zh 纯 CSS 折叠动画描述元数据 `duiCollapseAnimation`。
 */
export const duiCollapseAnimation: Readonly<{
  name: string;
  duration: number;
  easing: string;
  cssClass: string;
}> = {
  name: 'duiCollapse',
  duration: 150,
  easing: 'ease-in-out',
  cssClass: 'dui-message-collapsed',
};
