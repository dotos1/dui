/**
 * Class `ExternalError` encapsulating external error data structures and logic in `src/container/dock-layout/errors`.
 * @public
 * @zh 类 `ExternalError`，封装 `src/container/dock-layout/errors` 中的外部错误数据结构与处理逻辑。
 */
export abstract class ExternalError extends Error {
    /**
     * Creates an instance of `ExternalError` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ExternalError` 实例，并初始化其依赖项与内部状态。
     */
    constructor(public readonly type: string, message: string) {
        super(message);
    }
}

/**
 * Class `ConfigurationError` encapsulating configuration error data structures and logic in `src/container/dock-layout/errors`.
 * @public
 * @zh 类 `ConfigurationError`，封装 `src/container/dock-layout/errors` 中的配置项错误数据结构与处理逻辑。
 */
export class ConfigurationError extends ExternalError {
    /**
     * Creates an instance of `ConfigurationError` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ConfigurationError` 实例，并初始化其依赖项与内部状态。
     */
    constructor(message: string, public readonly node?: string) {
        super('Configuration', message);
    }
}

/**
 * Class `PopoutBlockedError` encapsulating popout blocked error data structures and logic in `src/container/dock-layout/errors`.
 * @public
 * @zh 类 `PopoutBlockedError`，封装 `src/container/dock-layout/errors` 中的弹出窗口已块错误数据结构与处理逻辑。
 */
export class PopoutBlockedError extends ExternalError {
    /**
     * Creates an instance of `PopoutBlockedError` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `PopoutBlockedError` 实例，并初始化其依赖项与内部状态。
     */
    constructor(message: string) {
        super('PopoutBlocked', message);
    }
}

/**
 * Class `ApiError` encapsulating api error data structures and logic in `src/container/dock-layout/errors`.
 * @public
 * @zh 类 `ApiError`，封装 `src/container/dock-layout/errors` 中的API接口错误数据结构与处理逻辑。
 */
export class ApiError extends ExternalError {
    /**
     * Creates an instance of `ApiError` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `ApiError` 实例，并初始化其依赖项与内部状态。
     */
    constructor(message: string) {
        super('API', message);
    }
}

/**
 * Class `BindError` encapsulating bind error data structures and logic in `src/container/dock-layout/errors`.
 * @public
 * @zh 类 `BindError`，封装 `src/container/dock-layout/errors` 中的绑定错误数据结构与处理逻辑。
 */
export class BindError extends ExternalError {
    /**
     * Creates an instance of `BindError` and initializes its dependencies and internal state.
     * @internal
     * @zh 创建 `BindError` 实例，并初始化其依赖项与内部状态。
     */
    constructor(message: string) {
        super('Bind', message);
    }
}
