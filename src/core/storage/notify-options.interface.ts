/**
 * @fileoverview Module `src/core/storage/notify-options.interface.ts` providing notify options interface definitions and implementation.
 * @zh 模块文件 `src/core/storage/notify-options.interface.ts`，提供通知配置选项interface相关的定义与实现。
 */

/**
 * Interface `INotifyOptions` defining the contract and properties for i notify options.
 * @zh 接口 `INotifyOptions`，定义I通知配置选项的数据结构契约与属性规范。
 */
export interface INotifyOptions {
    /**
     * Property `setItem` (`boolean`) storing set item.
     * @zh 属性 `setItem`（类型：`boolean`），用于存储或配置集合条目。
     */
    setItem?: boolean;
    /**
     * Property `removeItem` (`boolean`) storing remove item.
     * @zh 属性 `removeItem`（类型：`boolean`），用于存储或配置移除条目。
     */
    removeItem?: boolean;
}
