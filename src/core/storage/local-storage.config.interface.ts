/**
 * @fileoverview Module `src/core/storage/local-storage.config.interface.ts` providing local storage config interface definitions and implementation.
 * @zh 模块文件 `src/core/storage/local-storage.config.interface.ts`，提供本地存储配置interface相关的定义与实现。
 */

import { INotifyOptions } from './notify-options.interface';

/**
 * Interface `ILocalStorageServiceConfig` defining the contract and properties for i local storage service config.
 * @zh 接口 `ILocalStorageServiceConfig`，定义I本地存储服务配置的数据结构契约与属性规范。
 */
export interface ILocalStorageServiceConfig {
    // Properties:
    /**
     * Property `notifyOptions` (`INotifyOptions`) storing notify options.
     * @zh 属性 `notifyOptions`（类型：`INotifyOptions`），用于存储或配置通知配置选项。
     */
    notifyOptions?: INotifyOptions;
    /**
     * Property `prefix` (`string`) storing prefix.
     * @zh 属性 `prefix`（类型：`string`），用于存储或配置前缀。
     */
    prefix?: string;
    /**
     * Property `storageType` (`"sessionStorage" | "localStorage"`) storing storage type.
     * @zh 属性 `storageType`（类型：`"sessionStorage" | "localStorage"`），用于存储或配置存储类型。
     */
    storageType?: 'sessionStorage' | 'localStorage';
}
