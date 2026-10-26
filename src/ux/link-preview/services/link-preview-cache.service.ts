/**
 * @fileoverview Module `src/ux/link-preview/services/link-preview-cache.service.ts` providing link preview cache service definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/services/link-preview-cache.service.ts`，提供链接预览缓存服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Injectable Angular service `LinkPreviewCacheService` managing link preview cache service state and operations in `src/ux/link-preview/services`.
 * @zh 可注入的 Angular 服务 `LinkPreviewCacheService`，管理 `src/ux/link-preview/services` 中的链接预览缓存服务状态与业务操作。
 */
@Injectable()
export class LinkPreviewCacheService {
   /**
    * Holds the current cache state (RAM cache)
    * @zh 属性 `cache`（类型：`any`），用于存储或配置缓存（默认值：`{}`）。
    */
   private cache = {};

   /**
    * localStorage cache key
    * @zh 属性 `localStorageKey`（类型：`string`），用于存储或配置本地存储键（默认值：`'LinkPreviewCache_q16qy4aOCzm2'`）。
    */
   private localStorageKey = 'LinkPreviewCache_q16qy4aOCzm2';

   /**
    * Creates an instance of `LinkPreviewCacheService` and initializes its dependencies and internal state.
    * @zh 创建 `LinkPreviewCacheService` 实例，并初始化其依赖项与内部状态。
    */
   constructor() {
      this.loadCacheFromLocalStorage();
   }

   /**
    * Try to load the cache from localstorage

    * @zh 执行 `loadCacheFromLocalStorage`，用于加载缓存从本地存储。
    */
   private loadCacheFromLocalStorage(): void {
      try {
         // getItem 返回 null 时 JSON.parse 也返回 null，需要显式兜底成 {}，
         // 否则后续 this.cache[key] 会在 null 上取属性。
         this.cache = JSON.parse(localStorage.getItem(this.localStorageKey)) || {};
      } catch (e) {
         this.cache = {};
      }
   }

   /**
    * Update item in RAM cache

    * @zh 执行 `updateCacheItem`，用于更新缓存条目。
    */
   public updateCacheItem(cacheKey: string, data): void {
      if (!this.cache) {
         this.cache = {};
      }
      this.cache[cacheKey] = data;
      this.saveCache();
   }

   /**
    * Get item from cache

    * @zh 执行 `getCacheItem`，用于获取缓存条目。
    */
   public getCacheItem(cacheKey: string) {
      let cacheData;
      try {
         cacheData = this.cache[cacheKey];
      } catch (e) {
         cacheData = undefined;
      }

      if (!cacheData) {
         cacheData = undefined;
      }

      return cacheData;
   }

   /**
    * Save whole cache to localStorage

    * @zh 执行 `saveCache`，用于保存缓存。
    */
   public saveCache(): void {
      try {
         localStorage.setItem(this.localStorageKey, JSON.stringify(this.cache));
      } catch (e) {
         console.warn('Failed to save OgLinkPreviewCache in localStorage!', e);
      }
   }
}
