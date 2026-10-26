/**
 * @fileoverview Module `src/ux/windows/core/helpers/id-generator.helper.ts` providing id generator helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/helpers/id-generator.helper.ts`，提供唯一标识generator辅助工具相关的定义与实现。
 */

import { ɵRandomHelper } from './random.helper';

/**
 * Class `ɵIdGenerator` encapsulating ɵid generator data structures and logic in `src/ux/windows/core/helpers`.
 * @zh 类 `ɵIdGenerator`，封装 `src/ux/windows/core/helpers` 中的ɵIdGenerator数据结构与处理逻辑。
 */
export abstract class ɵIdGenerator {
    /**
     * Executes `generate` to handle generate.
     * @zh 执行 `generate`，用于生成。
     * @param name - name parameter (`string`) / 名称参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    public static generate(name: string = ''): string {
        const randomId = ɵRandomHelper.getRandomInt(1, 1000000);
        const nameAsPrefix = (name) ? `${name}-` : '';

        return `${nameAsPrefix}${randomId}`;
    }
}
