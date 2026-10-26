/**
 * Class `Params` encapsulating params data structures and logic in `src/ux/windows/core/helpers`.
 * @internal
 * @zh 类 `Params`，封装 `src/ux/windows/core/helpers` 中的参数集合数据结构与处理逻辑。
 */
class Params {
    /**
     * Property `delayBetweenChecksInMs` (`number`) storing delay between checks in ms (default: `8`).
     * @zh 属性 `delayBetweenChecksInMs`（类型：`number`），用于存储或配置延迟之间检查在毫秒（默认值：`8`）。
     */
    public delayBetweenChecksInMs: number = 8;
    /**
     * Property `maxCheckCount` (`number`) storing max check count (default: `30`).
     * @zh 属性 `maxCheckCount`（类型：`number`），用于存储或配置最大值检查计数（默认值：`30`）。
     */
    public maxCheckCount: number = 30;
}

/**
 * Interface `StartParams` defining the contract and properties for start params.
 * @internal
 * @zh 接口 `StartParams`，定义开始参数集合的数据结构契约与属性规范。
 */
interface StartParams {
    /**
     * Property `onIteration` (`() => void`) storing on iteration.
     * @zh 属性 `onIteration`（类型：`() => void`），用于存储或配置当Iteration。
     */
    onIteration?: () => void;
    /**
     * Property `onEnd` (`() => void`) storing on end.
     * @zh 属性 `onEnd`（类型：`() => void`），用于存储或配置当结束。
     */
    onEnd?: () => void;
}

/**
 * Class `ɵIntervalCheckerHelper` encapsulating ɵinterval checker helper data structures and logic in `src/ux/windows/core/helpers`.
 * @internal
 * @zh 类 `ɵIntervalCheckerHelper`，封装 `src/ux/windows/core/helpers` 中的ɵInterval检查器辅助工具数据结构与处理逻辑。
 */
export class ɵIntervalCheckerHelper {
    /**
     * Property `delayBetweenChecksInMs` (`number`) storing delay between checks in ms.
     * @zh 属性 `delayBetweenChecksInMs`（类型：`number`），用于存储或配置延迟之间检查在毫秒。
     */
    private delayBetweenChecksInMs: number;
    /**
     * Property `maxCheckCount` (`number`) storing max check count.
     * @zh 属性 `maxCheckCount`（类型：`number`），用于存储或配置最大值检查计数。
     */
    private maxCheckCount: number;

    /**
     * Property `passedCountOfChecks` (`number`) storing passed count of checks (default: `0`).
     * @zh 属性 `passedCountOfChecks`（类型：`number`），用于存储或配置已传递计数的检查（默认值：`0`）。
     */
    private passedCountOfChecks = 0;
    /**
     * Property `currentIntervalId` (`number`) storing current interval id (default: `0`).
     * @zh 属性 `currentIntervalId`（类型：`number`），用于存储或配置当前间隔定时器唯一标识（默认值：`0`）。
     */
    private currentIntervalId = 0;

    /**
     * Property `onIteration` (`() => void`) storing on iteration.
     * @zh 属性 `onIteration`（类型：`() => void`），用于存储或配置当Iteration。
     */
    private onIteration: () => void;
    /**
     * Property `onEnd` (`() => void`) storing on end.
     * @zh 属性 `onEnd`（类型：`() => void`），用于存储或配置当结束。
     */
    private onEnd: () => void;

    /**
     * Creates an instance of `ɵIntervalCheckerHelper` and initializes its dependencies and internal state.
     * @zh 创建 `ɵIntervalCheckerHelper` 实例，并初始化其依赖项与内部状态。
     * @param params - Injected or initial params (`Params`) / 注入或传入的参数集合（`Params`）
     */
    constructor(params: Params = new Params()) {
        this.updateSettings(params);
    }

    /**
     * Executes `updateSettings` to handle update settings.
     * @zh 执行 `updateSettings`，用于更新设置项。
     * @param { delayBetweenChecksInMs, maxC... - { delay between checks in ms, max c parameter (`Params`) / {延迟之间检查在Ms,最大值C参数（`Params`）
     */
    public updateSettings({ delayBetweenChecksInMs, maxCheckCount }: Params): void {
        this.delayBetweenChecksInMs = delayBetweenChecksInMs;
        this.maxCheckCount = maxCheckCount;
    }

    /**
     * Executes `start` to handle start.
     * @zh 执行 `start`，用于开始。
     * @param options - { on iteration, on end } parameter (`StartParams`) / {当Iteration,当结束}参数（`StartParams`）
     */
    public start({ onIteration, onEnd }: StartParams): void {
        this.onIteration = onIteration;
        this.onEnd = onEnd;

        if (this.currentIntervalId) {
            this.reset();
        }

        this.initChecking();
    }

    /**
     * Executes `reset` to handle reset.
     * @zh 执行 `reset`，用于重置。
     */
    public reset(): void {
        clearInterval(this.currentIntervalId);
        this.currentIntervalId = 0;
        this.passedCountOfChecks = 0;
    }

    /**
     * Executes `initChecking` to handle init checking.
     * @zh 执行 `initChecking`，用于初始化检查。
     */
    private initChecking(): void {
        this.currentIntervalId = window.setInterval(() => {
            this.passedCountOfChecks++;

            if (this.passedCountOfChecks < this.maxCheckCount) {
                this.onIteration?.();
            } else {
                this.reset();
                this.onEnd?.();
            }
        }, this.delayBetweenChecksInMs);
    }
}
