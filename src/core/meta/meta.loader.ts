/**
 * @fileoverview Module `src/core/meta/meta.loader.ts` providing meta loader definitions and implementation.
 * @zh 模块文件 `src/core/meta/meta.loader.ts`，提供元数据加载器相关的定义与实现。
 */

// module
import { PageTitlePositioning } from './models/page-title-positioning';
import { MetaSettings } from './models/meta-settings';

/**
 * Class `MetaLoader` encapsulating meta loader data structures and logic in `src/core/meta`.
 * @zh 类 `MetaLoader`，封装 `src/core/meta` 中的元数据加载器数据结构与处理逻辑。
 */
export abstract class MetaLoader {
  /**
   * Gets the current settings (`settings: MetaSettings`).
   * @zh 获取当前设置项（`settings: MetaSettings`）。
   */
  abstract get settings(): MetaSettings;
}

/**
 * Class `MetaStaticLoader` encapsulating meta static loader data structures and logic in `src/core/meta`.
 * @zh 类 `MetaStaticLoader`，封装 `src/core/meta` 中的元数据静态加载器数据结构与处理逻辑。
 */
export class MetaStaticLoader implements MetaLoader {
  /**
   * Gets the current settings (`settings: MetaSettings`).
   * @zh 获取当前设置项（`settings: MetaSettings`）。
   */
  get settings(): MetaSettings {
    return this.providedSettings;
  }

  /**
   * Creates an instance of `MetaStaticLoader` and initializes its dependencies and internal state.
   * @zh 创建 `MetaStaticLoader` 实例，并初始化其依赖项与内部状态。
   * @param providedSettings - Injected or initial provided settings (`MetaSettings`) / 注入或传入的已提供设置项（`MetaSettings`）
   */
  constructor(private readonly providedSettings: MetaSettings = {
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    defaults: {}
  }) {
  }
}
