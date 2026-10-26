/**
 * @fileoverview Module `src/core/services/locator.service.ts` providing locator service definitions and implementation.
 * @zh 模块文件 `src/core/services/locator.service.ts`，提供locator服务相关的定义与实现。
 */

import { Injector } from "@angular/core";

// @dynamic
/**
 * Class `ServiceLocator` encapsulating service locator data structures and logic in `src/core/services`.
 * @zh 类 `ServiceLocator`，封装 `src/core/services` 中的服务Locator数据结构与处理逻辑。
 */
export class ServiceLocator {
  /**
   * Property `injector` (`Injector`) storing injector.
   * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器。
   */
  static injector: Injector;
}
