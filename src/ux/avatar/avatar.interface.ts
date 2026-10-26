/**
 * @fileoverview Module `src/ux/avatar/avatar.interface.ts` providing avatar interface definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar.interface.ts`，提供头像interface相关的定义与实现。
 */

import { SafeUrl } from "@angular/platform-browser";
/**
 * Interface `IAVatar` defining the contract and properties for ia vatar.
 * @zh 接口 `IAVatar`，定义IAVatar的数据结构契约与属性规范。
 */
export interface IAVatar {

  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id: string;

  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name:string;

  /**
   * Property `src` (`string|SafeUrl`) storing src.
   * @zh 属性 `src`（类型：`string|SafeUrl`），用于存储或配置源路径。
   */
  src?:string|SafeUrl;

  /**
   * Property `avatar` (`string|SafeUrl`) storing avatar.
   * @zh 属性 `avatar`（类型：`string|SafeUrl`），用于存储或配置头像。
   */
  avatar?:string|SafeUrl;

  /**
   * Executes `getAvatar` to handle get avatar.
   * @zh 执行 `getAvatar`，用于获取头像。
   * @param size - size parameter (`number`) / 尺寸参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getAvatar(size: number): string;
}
