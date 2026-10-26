/**
 * @fileoverview Module `src/ux/windows/core/helpers/error.helper.ts` providing error helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/error.helper.ts`，提供错误辅助工具相关的定义与实现。
 */


/**
 * Class `ɵErrorHelper` encapsulating ɵerror helper data structures and logic in `src/ux/windows/core/helpers`.
 * @zh 类 `ɵErrorHelper`，封装 `src/ux/windows/core/helpers` 中的ɵError辅助工具数据结构与处理逻辑。
 */
export abstract class ɵErrorHelper {
    /**
     * Executes `warn` to handle warn.
     * @zh 执行 `warn`，用于警告色。
     * @param context - context parameter (`Object`) / 上下文参数（`Object`）
     * @param message - message parameter (`string`) / 消息参数（`string`）
     */
    public static warn(context: Object, message: string): void {
        const contextName = context.constructor.name;
        console.warn(`ngx-os: ${contextName}: ${message}`);
    }

    /**
     * Executes `error` to handle error.
     * @zh 执行 `error`，用于错误。
     * @param context - context parameter (`Object`) / 上下文参数（`Object`）
     * @param message - message parameter (`string`) / 消息参数（`string`）
     */
    public static error(context: Object, message: string): void {
        const contextName = context.constructor.name;

        throw new Error(`ngx-os: ${contextName}: ${message}`);
    }
}
