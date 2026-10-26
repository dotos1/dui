/**
 * @fileoverview Module `src/ux/multi-window/types/multi-window.config.ts` providing multi window config definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/types/multi-window.config.ts`，提供多窗口配置相关的定义与实现。
 */

import { WindowSaveStrategy } from './window-save-strategy.enum';

/**
 * Interface `MultiWindowConfig` defining the contract and properties for multi window config.
 * @zh 接口 `MultiWindowConfig`，定义多窗口配置的数据结构契约与属性规范。
 */
export interface MultiWindowConfig {
  /**
   * String to be used as prefix when storing data in the localstorage

   * @zh 属性 `keyPrefix`（类型：`string`），用于存储或配置键前缀。
   */
  keyPrefix?: string;

  /**
   * Time in milliseconds how often a heartbeat should be performed. During a heartbeat a window
   * looks for new messages from other windows and processes these messages.

   * @zh 属性 `heartbeat`（类型：`number`），用于存储或配置heartbeat。
   */
  heartbeat?: number;

  /**
   * Time in milliseconds how often a scan for new windows should be performed.

   * @zh 属性 `newWindowScan`（类型：`number`），用于存储或配置新窗口Scan。
   */
  newWindowScan?: number;

  /**
   * Time in milliseconds after which a message delivery is considered to have failed.
   * If no "message_received" confirmation has arrived during the specified duration,
   * the message will be removed from the outbox.

   * @zh 属性 `messageTimeout`（类型：`number`），用于存储或配置消息延时器。
   */
  messageTimeout?: number;

  /**
   * Time in milliseconds after which a window is considered dead.
   *
   * Should be a multiple of {@link MultiWindowConfig#newWindowScan}

   * @zh 属性 `windowTimeout`（类型：`number`），用于存储或配置窗口延时器。
   */
  windowTimeout?: number;

  /**
   * A strategy to be used when it comes to saving the window name.
   *
   * Refer to the different enum values for detailed description about the possible values.

   * @zh 属性 `windowSaveStrategy`（类型：`WindowSaveStrategy`），用于存储或配置窗口保存策略。
   */
  windowSaveStrategy?: WindowSaveStrategy;
}
