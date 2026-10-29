/**
 * @fileoverview Module `src/core/storage/local-storage.service.ts` providing local storage service definitions and implementation.
 * @zh 模块文件 `src/core/storage/local-storage.service.ts`，提供本地存储服务相关的定义与实现。
 */

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs';
import { ILocalStorageEvent } from './local-storage-events.interface';
import { INotifyOptions } from './notify-options.interface';
import { ILocalStorageServiceConfig } from './local-storage.config.interface';
import { share } from 'rxjs/operators';

/**
 * Constant/variable `DEPRECATED` defining deprecated in `src/core/storage`.
 * @zh 常量/变量 `DEPRECATED`，定义 `src/core/storage` 中的DEPRECATED。
 */
const DEPRECATED: string = 'This function is deprecated.';
/**
 * Constant/variable `LOCAL_STORAGE_NOT_SUPPORTED` defining local storage not supported in `src/core/storage`.
 * @zh 常量/变量 `LOCAL_STORAGE_NOT_SUPPORTED`，定义 `src/core/storage` 中的本地存储NOTSUPPORTED。
 */
const LOCAL_STORAGE_NOT_SUPPORTED: string = 'LOCAL_STORAGE_NOT_SUPPORTED';

/**
 * Injectable Angular service `LocalStorageService` managing local storage service state and operations in `src/core/storage`.
 * @zh 可注入的 Angular 服务 `LocalStorageService`，管理 `src/core/storage` 中的本地存储服务状态与业务操作。
 */
@Injectable()
export class LocalStorageService {
    /**
     * Property `isSupported` (`boolean`) storing is supported (default: `false`).
     * @zh 属性 `isSupported`（类型：`boolean`），用于存储或配置是否为Supported（默认值：`false`）。
     */
    public isSupported: boolean = false;

    /**
     * Property `errors$` (`Observable<string>`) storing errors.
     * @zh 属性 `errors$`（类型：`Observable<string>`），用于存储或配置错误列表。
     */
    public errors$: Observable<string>;
    /**
     * Property `removeItems$` (`Observable<ILocalStorageEvent>`) storing remove items.
     * @zh 属性 `removeItems$`（类型：`Observable<ILocalStorageEvent>`），用于存储或配置移除条目列表。
     */
    public removeItems$: Observable<ILocalStorageEvent>;
    /**
     * Property `setItems$` (`Observable<ILocalStorageEvent>`) storing set items.
     * @zh 属性 `setItems$`（类型：`Observable<ILocalStorageEvent>`），用于存储或配置集合条目列表。
     */
    public setItems$: Observable<ILocalStorageEvent>;
    /**
     * Property `warnings$` (`Observable<string>`) storing warnings.
     * @zh 属性 `warnings$`（类型：`Observable<string>`），用于存储或配置警告。
     */
    public warnings$: Observable<string>;

    /**
     * Property `notifyOptions` (`INotifyOptions`) storing notify options (default: `{ setItem: false, removeItem: false }`).
     * @zh 属性 `notifyOptions`（类型：`INotifyOptions`），用于存储或配置通知配置选项（默认值：`{ setItem: false, removeItem: false }`）。
     */
    private notifyOptions: INotifyOptions = {
        setItem: false,
        removeItem: false
    };
    /**
     * Property `prefix` (`string`) storing prefix (default: `'ls'`).
     * @zh 属性 `prefix`（类型：`string`），用于存储或配置前缀（默认值：`'ls'`）。
     */
    private prefix: string = 'ls';
    /**
     * Property `storageType` (`"sessionStorage" | "localStorage"`) storing storage type (default: `'localStorage'`).
     * @zh 属性 `storageType`（类型：`"sessionStorage" | "localStorage"`），用于存储或配置存储类型（默认值：`'localStorage'`）。
     */
    private storageType: 'sessionStorage' | 'localStorage' = 'localStorage';
    /**
     * Property `webStorage` (`Storage`) storing web storage.
     * @zh 属性 `webStorage`（类型：`Storage`），用于存储或配置web存储。
     */
    private webStorage: Storage;

    /**
     * Property `errors` (`Subscriber<string>`) storing errors (default: `new Subscriber<string>()`).
     * @zh 属性 `errors`（类型：`Subscriber<string>`），用于存储或配置错误列表（默认值：`new Subscriber<string>()`）。
     */
    private errors: Subscriber<string> = new Subscriber<string>();
    /**
     * Property `removeItems` (`Subscriber<ILocalStorageEvent>`) storing remove items (default: `new Subscriber<ILocalStorageEvent>()`).
     * @zh 属性 `removeItems`（类型：`Subscriber<ILocalStorageEvent>`），用于存储或配置移除条目列表（默认值：`new Subscriber<ILocalStorageEvent>()`）。
     */
    private removeItems: Subscriber<ILocalStorageEvent> = new Subscriber<ILocalStorageEvent>() ;
    /**
     * Property `setItems` (`Subscriber<ILocalStorageEvent>`) storing set items (default: `new Subscriber<ILocalStorageEvent>()`).
     * @zh 属性 `setItems`（类型：`Subscriber<ILocalStorageEvent>`），用于存储或配置集合条目列表（默认值：`new Subscriber<ILocalStorageEvent>()`）。
     */
    private setItems: Subscriber<ILocalStorageEvent> = new Subscriber<ILocalStorageEvent>();
    /**
     * Property `warnings` (`Subscriber<string>`) storing warnings (default: `new Subscriber<string>()`).
     * @zh 属性 `warnings`（类型：`Subscriber<string>`），用于存储或配置警告（默认值：`new Subscriber<string>()`）。
     */
    private warnings: Subscriber<string> = new Subscriber<string>();

    /**
     * Creates an instance of `LocalStorageService` and initializes its dependencies and internal state.
     * @zh 创建 `LocalStorageService` 实例，并初始化其依赖项与内部状态。
     * @param config - Injected or initial config (`ILocalStorageServiceConfig`) / 注入或传入的配置（`ILocalStorageServiceConfig`）
     */
    constructor (
        @Inject('LOCAL_STORAGE_SERVICE_CONFIG') config: ILocalStorageServiceConfig
    ) {
        const { notifyOptions, prefix, storageType } = config;

        if (notifyOptions != null) {
            const { setItem, removeItem } = notifyOptions;
            this.setNotify(!!setItem, !!removeItem);
        }
        if (prefix != null) {
            this.setPrefix(prefix);
        }
        if (storageType != null) {
            this.setStorageType(storageType);
        }

        this.errors$ = new Observable<string>((observer: Subscriber<string>) => this.errors = observer).pipe(share());
        this.removeItems$ = new Observable<ILocalStorageEvent>((observer: Subscriber<ILocalStorageEvent>) => this.removeItems = observer).pipe(share());
        this.setItems$ = new Observable<ILocalStorageEvent>((observer: Subscriber<ILocalStorageEvent>) => this.setItems = observer).pipe(share());
        this.warnings$ = new Observable<string>((observer: Subscriber<string>) => this.warnings = observer).pipe(share());

        this.isSupported = this.checkSupport();
    }

    /**
     * Executes `add` to handle add.
     * @zh 执行 `add`，用于添加。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public add (key: string, value): boolean {
        if (console && console.warn) {
            console.warn(DEPRECATED);
            console.warn('Use `LocalStorageService.set` instead.');
        }
        return this.set(key, value);
    }

    /**
     * Executes `clearAll` to handle clear all.
     * @zh 执行 `clearAll`，用于清空全部。
     * @param regularExpression - regular expression parameter (`string`) / regular表达式参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public clearAll (regularExpression?: string): boolean {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        const prefixRegex = this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        const testRegex = regularExpression ? new RegExp(regularExpression) : new RegExp('');

        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }

        const prefixLength = this.prefix.length;

        for (const key in this.webStorage) {
            // Only remove items that are for this app and match the regular expression
            if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
                try {
                    this.remove(key.substr(prefixLength));
                } catch (e) {
                    this.errors.next(e.message);
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Executes `deriveKey` to handle derive key.
     * @zh 执行 `deriveKey`，用于derive键。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    public deriveKey (key: string): string {
        return `${this.prefix}${key}`;
    }

    /**
     * Executes `has` to handle has.
     * @zh 执行 `has`，用于是否包含。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public has(key: string):boolean{
        return this.get(key)!=null;
    }

    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    public get <T> (key: string): T {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return null;
        }

        const item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
        // FIXME: not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
            return null;
        }

        try {
            return JSON.parse(item);
        } catch (e) {
            return null;
        }
    }

    /**
     * Executes `getStorageType` to handle get storage type.
     * @zh 执行 `getStorageType`，用于获取存储类型。
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    public getStorageType (): string {
        return this.storageType;
    }

    /**
     * Executes `keys` to handle keys.
     * @zh 执行 `keys`，用于键列表。
     * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
     */
    public keys (): Array<string> {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return [];
        }

        const prefixLength = this.prefix.length;
        const keys: Array<string> = [];
        for (const key in this.webStorage) {
            // Only return keys that are for this app
            if (key.substr(0, prefixLength) === this.prefix) {
                try {
                    keys.push(key.substr(prefixLength));
                } catch (e) {
                    this.errors.next(e.message);
                    return [];
                }
            }
        }
        return keys;
    }

    /**
     * Executes `length` to handle length.
     * @zh 执行 `length`，用于长度。
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public length (): number {
        let count = 0;
        const storage = this.webStorage;
        for (let i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    }

    /**
     * Executes `remove` to handle remove.
     * @zh 执行 `remove`，用于移除。
     * @param keys - keys parameter (`string[]`) / 键列表参数（`string[]`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public remove (...keys: Array<string>): boolean {
        let result = true;
        keys.forEach((key: string) => {
            if (!this.isSupported) {
                this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                result = false;
            }

            try {
                this.webStorage.removeItem(this.deriveKey(key));
                if (this.notifyOptions.removeItem) {
                    this.removeItems.next({
                        key: key,
                        storageType: this.storageType
                    });
                }
            } catch (e) {
                this.errors.next(e.message);
                result = false;
            }
        });
        return result;
    }

    /**
     * Executes `set` to handle set.
     * @zh 执行 `set`，用于集合。
     * @param key - key parameter (`string`) / 键参数（`string`）
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public set (key: string, value): boolean {
        // Let's convert `undefined` values to `null` to get the value consistent
        if (value === undefined) {
            value = null;
        } else {
            value = JSON.stringify(value);
        }

        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }

        try {
            if (this.webStorage) {
                this.webStorage.setItem(this.deriveKey(key), value);
            }
            if (this.notifyOptions.setItem) {
                this.setItems.next({
                    key: key,
                    newvalue: value,
                    storageType: this.storageType
                });
            }
        } catch (e) {
            this.errors.next(e.message);
            return false;
        }
        return true;
    }

    /**
     * Executes `checkSupport` to handle check support.
     * @zh 执行 `checkSupport`，用于检查Support。
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    private checkSupport (): boolean {
        try {
            const supported = this.storageType in window
                          && window[this.storageType] !== null;

            if (supported) {
                this.webStorage = window[this.storageType];

                // When Safari (OS X or iOS) is in private browsing mode, it
                // appears as though localStorage is available, but trying to
                // call .setItem throws an exception.
                //
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
                // to add something to storage that exceeded the quota."
                const key = this.deriveKey(`__${Math.round(Math.random() * 1e7)}`);
                this.webStorage.setItem(key, '');
                this.webStorage.removeItem(key);
            }

            return supported;
        } catch (e) {
            this.errors.next(e.message);
            return false;
        }
    }

    /**
     * Executes `setPrefix` to handle set prefix.
     * @zh 执行 `setPrefix`，用于集合前缀。
     * @param prefix - prefix parameter (`string`) / 前缀参数（`string`）
     */
    private setPrefix (prefix: string): void {
        this.prefix = prefix;

        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        const PERIOD: string = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = this.prefix ? `${this.prefix}${PERIOD}` : '';
        }
    }

    /**
     * Executes `setStorageType` to handle set storage type.
     * @zh 执行 `setStorageType`，用于集合存储类型。
     * @param storageType - storage type parameter (`"sessionStorage" | "localStorage"`) / 存储类型参数（`"sessionStorage" | "localStorage"`）
     */
    private setStorageType (storageType: 'sessionStorage' | 'localStorage'): void {
        this.storageType = storageType;
    }

    /**
     * Executes `setNotify` to handle set notify.
     * @zh 执行 `setNotify`，用于集合通知。
     * @param setItem - set item parameter (`boolean`) / 集合条目参数（`boolean`）
     * @param removeItem - remove item parameter (`boolean`) / 移除条目参数（`boolean`）
     */
    private setNotify (setItem: boolean, removeItem: boolean): void {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    }
}
