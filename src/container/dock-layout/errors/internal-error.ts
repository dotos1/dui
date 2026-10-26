/**
 * Class `InternalError` encapsulating internal error data structures and logic in `src/container/dock-layout/errors`.
 * @internal
 * @zh 类 `InternalError`，封装 `src/container/dock-layout/errors` 中的内部错误数据结构与处理逻辑。
 */
abstract class InternalError extends Error {
    /**
     * Creates an instance of `InternalError` and initializes its dependencies and internal state.
     * @zh 创建 `InternalError` 实例，并初始化其依赖项与内部状态。
     * @param type - Injected or initial type (`string`) / 注入或传入的类型（`string`）
     * @param code - Injected or initial code (`string`) / 注入或传入的编码（`string`）
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     */
    constructor(type: string, code: string, message?: string) {
        super(`${type}: ${code}${message === undefined ? '' : ': ' + message}`)
    }
}

/**
 * Class `AssertError` encapsulating assert error data structures and logic in `src/container/dock-layout/errors`.
 * @internal
 * @zh 类 `AssertError`，封装 `src/container/dock-layout/errors` 中的断言错误数据结构与处理逻辑。
 */
export class AssertError extends InternalError {
    /**
     * Creates an instance of `AssertError` and initializes its dependencies and internal state.
     * @zh 创建 `AssertError` 实例，并初始化其依赖项与内部状态。
     * @param code - Injected or initial code (`string`) / 注入或传入的编码（`string`）
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     */
    constructor(code: string, message?: string) {
        super('Assert', code, message)
    }
}

/**
 * Class `UnreachableCaseError` encapsulating unreachable case error data structures and logic in `src/container/dock-layout/errors`.
 * @internal
 * @zh 类 `UnreachableCaseError`，封装 `src/container/dock-layout/errors` 中的UnreachableCase错误数据结构与处理逻辑。
 */
export class UnreachableCaseError extends InternalError {
    /**
     * Creates an instance of `UnreachableCaseError` and initializes its dependencies and internal state.
     * @zh 创建 `UnreachableCaseError` 实例，并初始化其依赖项与内部状态。
     * @param code - Injected or initial code (`string`) / 注入或传入的编码（`string`）
     * @param variableValue - Injected or initial variable value (`never`) / 注入或传入的variable值（`never`）
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     */
    constructor(code: string, variableValue: never, message?: string) {
        super('UnreachableCase', code, `${variableValue}${message === undefined ? '' : ': ' + message}`)
    }
}

/**
 * Class `UnexpectedNullError` encapsulating unexpected null error data structures and logic in `src/container/dock-layout/errors`.
 * @internal
 * @zh 类 `UnexpectedNullError`，封装 `src/container/dock-layout/errors` 中的Unexpected空值错误数据结构与处理逻辑。
 */
export class UnexpectedNullError extends InternalError {
    /**
     * Creates an instance of `UnexpectedNullError` and initializes its dependencies and internal state.
     * @zh 创建 `UnexpectedNullError` 实例，并初始化其依赖项与内部状态。
     * @param code - Injected or initial code (`string`) / 注入或传入的编码（`string`）
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     */
    constructor(code: string, message?: string) {
        super('UnexpectedNull', code, message)
    }
}

/**
 * Class `UnexpectedUndefinedError` encapsulating unexpected undefined error data structures and logic in `src/container/dock-layout/errors`.
 * @internal
 * @zh 类 `UnexpectedUndefinedError`，封装 `src/container/dock-layout/errors` 中的Unexpected未定义错误数据结构与处理逻辑。
 */
export class UnexpectedUndefinedError extends InternalError {
    /**
     * Creates an instance of `UnexpectedUndefinedError` and initializes its dependencies and internal state.
     * @zh 创建 `UnexpectedUndefinedError` 实例，并初始化其依赖项与内部状态。
     * @param code - Injected or initial code (`string`) / 注入或传入的编码（`string`）
     * @param message - Injected or initial message (`string`) / 注入或传入的消息（`string`）
     */
    constructor(code: string, message?: string) {
        super('UnexpectedUndefined', code, message)
    }
}
