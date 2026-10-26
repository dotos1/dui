/**
 * @fileoverview Module `src/core/auth/model/redirection.model.ts` providing redirection model definitions and implementation.
 * @zh 模块文件 `src/core/auth/model/redirection.model.ts`，提供redirection模型相关的定义与实现。
 */


/**
 * Class `RedirectionModel` encapsulating redirection model data structures and logic in `src/core/auth/model`.
 * @zh 类 `RedirectionModel`，封装 `src/core/auth/model` 中的Redirection模型数据结构与处理逻辑。
 */
export class RedirectionModel {
    /**
     * Property `provider` (`string`) storing provider.
     * @zh 属性 `provider`（类型：`string`），用于存储或配置提供者。
     */
    provider: string;
    /**
     * Property `url` (`string`) storing url.
     * @zh 属性 `url`（类型：`string`），用于存储或配置链接地址。
     */
    url?: string;
    /**
     * Creates an instance of `RedirectionModel` and initializes its dependencies and internal state.
     * @zh 创建 `RedirectionModel` 实例，并初始化其依赖项与内部状态。
     * @param obj - Injected or initial obj (`any`) / 注入或传入的对象（`any`）
     */
    constructor(obj?) {
        if (obj) {
            this.provider = obj.provider;
            this.url = obj.url || null;
        }
    }
}
