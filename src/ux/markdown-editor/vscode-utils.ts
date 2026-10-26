/**
 * @fileoverview Module `src/ux/markdown-editor/vscode-utils.ts` providing vscode utils definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/vscode-utils.ts`，提供vscode工具集相关的定义与实现。
 */

/**
 * Executes `regExpLeadsToEndlessLoop` to handle reg exp leads to endless loop.
 * @zh 执行 `regExpLeadsToEndlessLoop`，用于regExpLeads转换为EndlessLoop。
 * @param regexp - regexp parameter (`RegExp`) / regexp参数（`RegExp`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function regExpLeadsToEndlessLoop(regexp: RegExp): boolean {
    if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
        return false;
    }
    const match = regexp.exec('');
    return !!(match && regexp.lastIndex === 0);
}


