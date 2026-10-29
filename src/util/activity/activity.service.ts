/**
 * @fileoverview Module `src/util/activity/activity.service.ts` providing activity service definitions and implementation.
 * @zh 模块文件 `src/util/activity/activity.service.ts`，提供activity服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { uuid } from '../uuid';

/**
 * Injectable Angular service `ActivityService` managing activity service state and operations in `src/util/activity`.
 * @zh 可注入的 Angular 服务 `ActivityService`，管理 `src/util/activity` 中的Activity服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  /**
   * Property `counter$` (`BehaviorSubject<number>`) storing counter (default: `new BehaviorSubject<number>(0)`).
   * @zh 属性 `counter$`（类型：`BehaviorSubject<number>`），用于存储或配置计数器（默认值：`new BehaviorSubject<number>(0)`）。
   */
  public counter$ = new BehaviorSubject<number>(0);

  /**
   * Property `ids` (`string[]`) storing ids (default: `[]`).
   * @zh 属性 `ids`（类型：`string[]`），用于存储或配置标识列表（默认值：`[]`）。
   */
  private ids: string[] = [];

  /**
   * Creates an instance of `ActivityService` and initializes its dependencies and internal state.
   * @zh 创建 `ActivityService` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {}

  /**
   * Executes `register` to handle register.
   * @zh 执行 `register`，用于注册。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  register(): string {
    const id = uuid();
    this.ids.push(id);
    this.counter$.next(this.ids.length);

    return id;
  }

  /**
   * Executes `unregister` to handle unregister.
   * @zh 执行 `unregister`，用于注销。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   */
  unregister(id: string) {
    const index = this.ids.indexOf(id);
    if (index === -1) {
      return;
    }
    this.ids.splice(index, 1);

    this.counter$.next(this.ids.length);
  }
}
