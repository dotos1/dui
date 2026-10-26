/**
 * @fileoverview Module `src/ux/windows/core/helpers/random.helper.ts` providing random helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/random.helper.ts`，提供随机辅助工具相关的定义与实现。
 */


/**
 * Class `ɵRandomHelper` encapsulating ɵrandom helper data structures and logic in `src/ux/windows/core/helpers`.
 * @zh 类 `ɵRandomHelper`，封装 `src/ux/windows/core/helpers` 中的ɵRandom辅助工具数据结构与处理逻辑。
 */
export abstract class ɵRandomHelper {
    /**
     * Executes `getRandomInt` to handle get random int.
     * @zh 执行 `getRandomInt`，用于获取随机Int。
     * @param min - min parameter (`number`) / 最小值参数（`number`）
     * @param max - max parameter (`number`) / 最大值参数（`number`）
     * @returns Result of type `number` / 类型为 `number` 的返回值
     */
    public static getRandomInt(min: number, max: number): number {
        const minN = Math.ceil(min);
        const maxN = Math.floor(max);

        return Math.floor(Math.random() * (maxN - minN)) + minN;
    }
}
