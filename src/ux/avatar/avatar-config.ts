/**
 * @fileoverview Module `src/ux/avatar/avatar-config.ts` providing avatar config definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar-config.ts`，提供头像配置相关的定义与实现。
 */



/**
 * Interface `AvatarConfig` defining the contract and properties for avatar config.
 * @zh 接口 `AvatarConfig`，定义头像配置的数据结构契约与属性规范。
 */
export interface AvatarConfig {
  /**
   * The avatars colors.

   * @zh 属性 `colors`（类型：`string[]`），用于存储或配置颜色列表。
   */
  colors?: string[];

}
