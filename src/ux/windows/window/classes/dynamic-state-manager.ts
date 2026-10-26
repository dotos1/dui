/**
 * @fileoverview Module `src/ux/windows/window/classes/dynamic-state-manager.ts` providing dynamic state manager definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/classes/dynamic-state-manager.ts`，提供动态状态管理器相关的定义与实现。
 */

import { ɵDynamicStateEnum } from '../enums';

/**
 * Class `ɵDynamicStateManager` encapsulating ɵdynamic state manager data structures and logic in `src/ux/windows/window/classes`.
 * @internal
 * @zh 类 `ɵDynamicStateManager`，封装 `src/ux/windows/window/classes` 中的ɵDynamic状态管理器数据结构与处理逻辑。
 */
export class ɵDynamicStateManager {
    /**
     * Gets the current state (`state: ɵDynamicStateEnum`).
     * @zh 获取当前状态（`state: ɵDynamicStateEnum`）。
     */
    public get state(): ɵDynamicStateEnum {
        return this._state;
    }

    /**
     * Property `_state` (`ɵDynamicStateEnum`) storing state.
     * @zh 属性 `_state`（类型：`ɵDynamicStateEnum`），用于存储或配置状态。
     */
    private _state: ɵDynamicStateEnum;

    /**
     * Property `afterStartCallback` (`() => void`) storing after start callback.
     * @zh 属性 `afterStartCallback`（类型：`() => void`），用于存储或配置之后开始回调函数。
     */
    private afterStartCallback: () => void;
    /**
     * Property `afterEndCallback` (`() => void`) storing after end callback.
     * @zh 属性 `afterEndCallback`（类型：`() => void`），用于存储或配置之后结束回调函数。
     */
    private afterEndCallback: () => void;
    /**
     * Property `currentStateTimeoutId` (`number`) storing current state timeout id.
     * @zh 属性 `currentStateTimeoutId`（类型：`number`），用于存储或配置当前状态延时器唯一标识。
     */
    private currentStateTimeoutId: number;
    /**
     * Property `cssAnimationClassDuration` (`number`) storing css animation class duration (default: `500`).
     * @zh 属性 `cssAnimationClassDuration`（类型：`number`），用于存储或配置CSS样式动画类名持续时间（默认值：`500`）。
     */
    private readonly cssAnimationClassDuration: number = 500;

    /**
     * Executes `is` to handle is.
     * @zh 执行 `is`，用于是否为。
     * @param state - state parameter (`ɵDynamicStateEnum`) / 状态参数（`ɵDynamicStateEnum`）
     * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
     */
    public is(state: ɵDynamicStateEnum): boolean {
        return (state === this._state);
    }

    /**
     * Executes `apply` to handle apply.
     * @zh 执行 `apply`，用于应用。
     * @param state - state parameter (`ɵDynamicStateEnum`) / 状态参数（`ɵDynamicStateEnum`）
     */
    public apply(state: ɵDynamicStateEnum): void {
        if (this.state === state) {
            return;
        }

        clearTimeout(this.currentStateTimeoutId);

        this._state = state;

        this.currentStateTimeoutId = window.setTimeout(() => {
            this._state = null;

            this.afterEndCallback?.();
        }, this.cssAnimationClassDuration);

        this.afterStartCallback?.();
    }

    /**
     * Executes `registerAfterStartCallback` to handle register after start callback.
     * @zh 执行 `registerAfterStartCallback`，用于注册之后开始回调函数。
     * @param callback - callback parameter (`() => void`) / 回调函数参数（`() => void`）
     */
    public registerAfterStartCallback(callback: () => void): void {
        this.afterStartCallback = callback;
    }

    /**
     * Executes `registerAfterEndCallback` to handle register after end callback.
     * @zh 执行 `registerAfterEndCallback`，用于注册之后结束回调函数。
     * @param callback - callback parameter (`() => void`) / 回调函数参数（`() => void`）
     */
    public registerAfterEndCallback(callback: () => void): void {
        this.afterEndCallback = callback;
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    public destroy(): void {
        clearTimeout(this.currentStateTimeoutId);
    }
}
