/**
 * @fileoverview Module `src/core/storage/local-storage-events.interface.ts` providing local storage events interface definitions and implementation.
 * @zh 模块文件 `src/core/storage/local-storage-events.interface.ts`，提供本地存储事件集合interface相关的定义与实现。
 */

/**
 * Interface `ILocalStorageEvent` defining the contract and properties for i local storage event.
 * @zh 接口 `ILocalStorageEvent`，定义I本地存储事件的数据结构契约与属性规范。
 */
export interface ILocalStorageEvent {
    /**
     * Property `key` (`string`) storing key.
     * @zh 属性 `key`（类型：`string`），用于存储或配置键。
     */
    key: string;
    /**
     * Property `newvalue` (`any`) storing newvalue.
     * @zh 属性 `newvalue`（类型：`any`），用于存储或配置newvalue。
     */
    newvalue?;
    /**
     * Property `storageType` (`string`) storing storage type.
     * @zh 属性 `storageType`（类型：`string`），用于存储或配置存储类型。
     */
    storageType: string;
}

