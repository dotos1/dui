/**
 * @fileoverview Module `src/core/config/http-loader/config.http-loader.ts` providing config http loader definitions and implementation.
 * @zh 模块文件 `src/core/config/http-loader/config.http-loader.ts`，提供配置HTTP加载器相关的定义与实现。
 */


import { forwardRef, Inject, resolveForwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigLoader } from '../config.loader';

/**
 * Class `ConfigHttpLoader` encapsulating config http loader data structures and logic in `src/core/config/http-loader`.
 * @zh 类 `ConfigHttpLoader`，封装 `src/core/config/http-loader` 中的配置HTTP加载器数据结构与处理逻辑。
 */
export class ConfigHttpLoader implements ConfigLoader {
  /**
   * Creates an instance of `ConfigHttpLoader` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigHttpLoader` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param endpoint - Injected or initial endpoint (`string`) / 注入或传入的endpoint（`string`）
   */
  constructor(@Inject(forwardRef(() => HttpClient)) private readonly http: HttpClient,
              private readonly endpoint: string = '/config.json') {
  }

  /**
   * Executes `loadSettings` to handle load settings.
   * @zh 执行 `loadSettings`，用于加载设置项。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  loadSettings() {
    return new Promise((resolve, reject) => {
      const http = resolveForwardRef(this.http);

      http.get(this.endpoint)
        .subscribe(
        (res) => resolve(res),
        (res) => {
          reject(res)
        });
    });
  }
}
