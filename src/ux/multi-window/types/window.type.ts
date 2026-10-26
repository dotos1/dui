/**
 * @fileoverview Module `src/ux/multi-window/types/window.type.ts` providing window type definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/types/window.type.ts`，提供窗口类型相关的定义与实现。
 */

import { Message } from './message.type';

/**
 * Interface `WindowData` defining the contract and properties for window data.
 * @zh 接口 `WindowData`，定义窗口数据的数据结构契约与属性规范。
 */
export interface WindowData {
  /**
   * Property `heartbeat` (`number`) storing heartbeat.
   * @zh 属性 `heartbeat`（类型：`number`），用于存储或配置heartbeat。
   */
  heartbeat: number;
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id: string;
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
}

/**
 * Interface `KnownAppWindow` defining the contract and properties for known app window.
 * @zh 接口 `KnownAppWindow`，定义KnownApp窗口的数据结构契约与属性规范。
 */
export interface KnownAppWindow extends WindowData {
  /**
   * Property `stalled` (`boolean`) storing stalled.
   * @zh 属性 `stalled`（类型：`boolean`），用于存储或配置stalled。
   */
  stalled: boolean;
  /**
   * Property `self` (`boolean`) storing self.
   * @zh 属性 `self`（类型：`boolean`），用于存储或配置自身。
   */
  self: boolean;
}

/**
 * Represents a window with the current application how it is stored
 * in the localstorage. It has an id, name, heartbeat represented in a timestamp
 * and an array of messages that that window sent out.
 *
 * It's named "AppWindow" to avoid confusion with the type Window
 * of the global variable "window".

 * @zh 接口 `AppWindow`，定义App窗口的数据结构契约与属性规范。
 */
export interface AppWindow extends WindowData {
  /**
   * Property `messages` (`Message[]`) storing messages.
   * @zh 属性 `messages`（类型：`Message[]`），用于存储或配置消息列表。
   */
  messages: Message[];
}
