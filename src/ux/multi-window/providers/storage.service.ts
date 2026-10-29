/**
 * @fileoverview Module `src/ux/multi-window/providers/storage.service.ts` providing storage service definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/providers/storage.service.ts`，提供存储服务相关的定义与实现。
 */

import { Injectable, Optional, SkipSelf } from '@angular/core';

/**
 * Injectable Angular service `WStorageService` managing w storage service state and operations in `src/ux/multi-window/providers`.
 * @zh 可注入的 Angular 服务 `WStorageService`，管理 `src/ux/multi-window/providers` 中的W存储服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class WStorageService {

  /**
   * Property `window` (`Window`) storing window.
   * @zh 属性 `window`（类型：`Window`），用于存储或配置窗口。
   */
  private window: Window;
  /**
   * Property `localStorage` (`Storage`) storing local storage.
   * @zh 属性 `localStorage`（类型：`Storage`），用于存储或配置本地存储。
   */
  private localStorage: Storage;
  /**
   * Property `sessionStorage` (`Storage`) storing session storage.
   * @zh 属性 `sessionStorage`（类型：`Storage`），用于存储或配置会话存储。
   */
  private sessionStorage: Storage;

  /**
   * Creates an instance of `WStorageService` and initializes its dependencies and internal state.
   * @zh 创建 `WStorageService` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.window = window;
    this.localStorage = window.localStorage;
    this.sessionStorage = window.sessionStorage;
  }

  /**
   * Executes `setLocalObject` to handle set local object.
   * @zh 执行 `setLocalObject`，用于集合本地对象。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public setLocalObject(key: string, obj): boolean {
    return this.setObject(this.localStorage, key, obj);
  }

  /**
   * Executes `setLocalItem` to handle set local item.
   * @zh 执行 `setLocalItem`，用于集合本地条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`string`) / 对象参数（`string`）
   */
  public setLocalItem(key: string, obj: string): void {
    this.setItem(this.localStorage, key, obj);
  }

  /**
   * Executes `setSessionObject` to handle set session object.
   * @zh 执行 `setSessionObject`，用于集合会话对象。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public setSessionObject(key: string, obj): boolean {
    return this.setObject(this.sessionStorage, key, obj);
  }

  /**
   * Executes `setSessionItem` to handle set session item.
   * @zh 执行 `setSessionItem`，用于集合会话条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`string`) / 对象参数（`string`）
   */
  public setSessionItem(key: string, obj: string): void {
    this.setItem(this.sessionStorage, key, obj);
  }

  /**
   * Executes `setObject` to handle set object.
   * @zh 执行 `setObject`，用于集合对象。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private setObject(storage: Storage, key: string, obj): boolean {
    let jsonString: string;
    try {
      jsonString = JSON.stringify(obj);
    } catch (ex) {
      return false;
    }
    this.setItem(storage, key, jsonString);

    return true;
  }

  /**
   * Executes `setItem` to handle set item.
   * @zh 执行 `setItem`，用于集合条目。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @param obj - obj parameter (`string`) / 对象参数（`string`）
   */
  private setItem(storage: Storage, key: string, obj: string): void {
    storage.setItem(key, obj);
  }

  /**
   * Executes `setWindowName` to handle set window name.
   * @zh 执行 `setWindowName`，用于集合窗口名称。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  public setWindowName(value: string): void {
    this.window.name = value;
  }

  /**
   * Executes `getLocalObject` to handle get local object.
   * @zh 执行 `getLocalObject`，用于获取本地对象。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `T` / 类型为 `T` 的返回值
   */
  public getLocalObject<T>(key: string): T | null {
    return this.getObject<T>(this.localStorage, key);
  }

  /**
   * Executes `getLocalObjects` to handle get local objects.
   * @zh 执行 `getLocalObjects`，用于获取本地对象。
   * @param keys - keys parameter (`string[]`) / 键列表参数（`string[]`）
   * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
   */
  public getLocalObjects<T>(keys: string[]): (T | null)[] {
    return this.getObjects<T>(this.localStorage, keys);
  }

  /**
   * Executes `getLocalItem` to handle get local item.
   * @zh 执行 `getLocalItem`，用于获取本地条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getLocalItem(key: string): string | null {
    return this.getItem(this.localStorage, key);
  }

  /**
   * Executes `getSessionObject` to handle get session object.
   * @zh 执行 `getSessionObject`，用于获取会话对象。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `T` / 类型为 `T` 的返回值
   */
  public getSessionObject<T>(key: string): T | null {
    return this.getObject<T>(this.sessionStorage, key);
  }

  /**
   * Executes `getSessionObjects` to handle get session objects.
   * @zh 执行 `getSessionObjects`，用于获取会话对象。
   * @param keys - keys parameter (`string[]`) / 键列表参数（`string[]`）
   * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
   */
  public getSessionObjects<T>(keys: string[]): (T | null)[] {
    return this.getObjects<T>(this.sessionStorage, keys);
  }

  /**
   * Executes `getSessionItem` to handle get session item.
   * @zh 执行 `getSessionItem`，用于获取会话条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getSessionItem(key: string): string | null {
    return this.getItem(this.sessionStorage, key);
  }

  /**
   * Executes `getObjects` to handle get objects.
   * @zh 执行 `getObjects`，用于获取对象。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param keys - keys parameter (`string[]`) / 键列表参数（`string[]`）
   * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
   */
  public getObjects<T>(storage: Storage, keys: string[]): (T | null)[] {
    return keys.map(key => this.getObject<T>(storage, key));
  }

  /**
   * Executes `getObject` to handle get object.
   * @zh 执行 `getObject`，用于获取对象。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `T` / 类型为 `T` 的返回值
   */
  private getObject<T>(storage: Storage, key: string): T | null {
    const jsonString = this.getItem(storage, key);
    if (jsonString === null) {
      return null;
    }
    try {
      return JSON.parse(jsonString) as T;
    } catch (ex) {
      return null;
    }
  }

  /**
   * Executes `getItem` to handle get item.
   * @zh 执行 `getItem`，用于获取条目。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getItem(storage: Storage, key: string): string | null {
    return storage.getItem(key) || null;
  }

  /**
   * Executes `getWindowName` to handle get window name.
   * @zh 执行 `getWindowName`，用于获取窗口名称。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getWindowName(): string {
    return this.window.name;
  }

  /**
   * Executes `removeLocalItem` to handle remove local item.
   * @zh 执行 `removeLocalItem`，用于移除本地条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  public removeLocalItem(key: string): void {
    this.removeItem(this.localStorage, key);
  }

  /**
   * Executes `removeSessionItem` to handle remove session item.
   * @zh 执行 `removeSessionItem`，用于移除会话条目。
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  public removeSessionItem(key: string): void {
    this.removeItem(this.sessionStorage, key);
  }

  /**
   * Executes `removeItem` to handle remove item.
   * @zh 执行 `removeItem`，用于移除条目。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   */
  private removeItem(storage: Storage, key: string): void {
    storage.removeItem(key);
  }

  /**
   * Executes `clearLocalStorage` to handle clear local storage.
   * @zh 执行 `clearLocalStorage`，用于清空本地存储。
   */
  public clearLocalStorage(): void {
    this.clearStorage(this.localStorage);
  }

  /**
   * Executes `clearSessionStorage` to handle clear session storage.
   * @zh 执行 `clearSessionStorage`，用于清空会话存储。
   */
  public clearSessionStorage(): void {
    this.clearStorage(this.sessionStorage);
  }

  /**
   * Executes `clearStorage` to handle clear storage.
   * @zh 执行 `clearStorage`，用于清空存储。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   */
  private clearStorage(storage: Storage): void {
    storage.clear();
  }


  /**
   * Executes `getLocalItemKeys` to handle get local item keys.
   * @zh 执行 `getLocalItemKeys`，用于获取本地条目键列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  public getLocalItemKeys(): string[] {
    return this.getStorageItemKeys(this.localStorage);
  }

  /**
   * Executes `getSessionItemKeys` to handle get session item keys.
   * @zh 执行 `getSessionItemKeys`，用于获取会话条目键列表。
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  public getSessionItemKeys(): string[] {
    return this.getStorageItemKeys(this.sessionStorage);
  }

  /**
   * Executes `getStorageItemKeys` to handle get storage item keys.
   * @zh 执行 `getStorageItemKeys`，用于获取存储条目键列表。
   * @param storage - storage parameter (`Storage`) / 存储参数（`Storage`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  private getStorageItemKeys(storage: Storage): string[] {
    const keys = [];
    for (let i = 0; i < storage.length; i++) {
      keys.push(storage.key(i));
    }

    return keys;
  }
}

/* singleton pattern taken from https://github.com/angular/angular/issues/13854 */
/**
 * Constant/variable `StorageServiceProviderFactory` defining storage service provider factory in `src/ux/multi-window/providers`.
 * @zh 常量/变量 `StorageServiceProviderFactory`，定义 `src/ux/multi-window/providers` 中的存储服务提供者工厂。
 */
export const StorageServiceProviderFactory = (parentDispatcher: WStorageService) => {
  return parentDispatcher || new WStorageService();
};

/**
 * Constant/variable `StorageServiceProvider` defining storage service provider in `src/ux/multi-window/providers`.
 * @zh 常量/变量 `StorageServiceProvider`，定义 `src/ux/multi-window/providers` 中的存储服务提供者。
 */
export const StorageServiceProvider = {
  provide: WStorageService,
  deps: [[new Optional(), new SkipSelf(), WStorageService]],
  useFactory: StorageServiceProviderFactory,
};
