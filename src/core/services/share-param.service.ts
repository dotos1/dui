/**
 * @fileoverview Module `src/core/services/share-param.service.ts` providing share param service definitions and implementation.
 * @zh 模块文件 `src/core/services/share-param.service.ts`，提供share参数服务相关的定义与实现。
 */


import { Injectable} from '@angular/core';

/**
 * Injectable Angular service `ShareParamService` managing share param service state and operations in `src/core/services`.
 * @zh 可注入的 Angular 服务 `ShareParamService`，管理 `src/core/services` 中的Share参数服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ShareParamService {

  /**
   * Property `data` (`Record<string, unknown>`) storing data (default: `{}`).
   * @zh 属性 `data`（类型：`Record<string, unknown>`），用于存储或配置数据（默认值：`{}`）。
   */
  data: Record<string, unknown> = {};

  /**
   * Creates an instance of `ShareParamService` and initializes its dependencies and internal state.
   * @zh 创建 `ShareParamService` 实例，并初始化其依赖项与内部状态。
   */
  constructor() { }

    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param name - name parameter (`any`) / 名称参数（`any`）
     * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
     */
    get(name) {
        return this.data[name];
    }

    /**
     * Executes `set` to handle set.
     * @zh 执行 `set`，用于集合。
     * @param name - name parameter (`any`) / 名称参数（`any`）
     * @param value - value parameter (`any`) / 值参数（`any`）
     */
    set(name,value) {
        this.data[name] = value;
    }

    /**
     * Executes `clear` to handle clear.
     * @zh 执行 `clear`，用于清空。
     * @returns Result of type `void` / 类型为 `void` 的返回值
     */
    clear() {
        this.data = {};
    }
}
