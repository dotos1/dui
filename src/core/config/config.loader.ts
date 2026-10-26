/**
 * @fileoverview Module `src/core/config/config.loader.ts` providing config loader definitions and implementation.
 * @zh 模块文件 `src/core/config/config.loader.ts`，提供配置加载器相关的定义与实现。
 */

/**
 * Class `ConfigLoader` encapsulating config loader data structures and logic in `src/core/config`.
 * @zh 类 `ConfigLoader`，封装 `src/core/config` 中的配置加载器数据结构与处理逻辑。
 */
export abstract class ConfigLoader {
  /**
   * Executes `loadSettings` to handle load settings.
   * @zh 执行 `loadSettings`，用于加载设置项。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  abstract loadSettings();
}

/**
 * Class `ConfigStaticLoader` encapsulating config static loader data structures and logic in `src/core/config`.
 * @zh 类 `ConfigStaticLoader`，封装 `src/core/config` 中的配置静态加载器数据结构与处理逻辑。
 */
export class ConfigStaticLoader implements ConfigLoader {
  /**
   * Creates an instance of `ConfigStaticLoader` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigStaticLoader` 实例，并初始化其依赖项与内部状态。
   * @param providedSettings - Injected or initial provided settings (`any`) / 注入或传入的已提供设置项（`any`）
   */
  constructor(private readonly providedSettings?) {
  }

  /**
   * Executes `loadSettings` to handle load settings.
   * @zh 执行 `loadSettings`，用于加载设置项。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  loadSettings() {
    return Promise.resolve(this.providedSettings);
  }
}
