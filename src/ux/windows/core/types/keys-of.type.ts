/**
 * @fileoverview Module `src/ux/windows/core/types/keys-of.type.ts` providing keys of type definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/types/keys-of.type.ts`，提供键列表的类型相关的定义与实现。
 */


/**
 * Type alias `ɵKeysOfType` representing ɵkeys of type (`{ [P in keyof T]: T[P] extends PropType ? P : never }[keyof T]`).
 * @zh 类型别名 `ɵKeysOfType`，表示ɵKeys的类型（`{ [P in keyof T]: T[P] extends PropType ? P : never }[keyof T]`）。
 */
export type ɵKeysOfType<T, PropType> = {
    [P in keyof T]: T[P] extends PropType ? P : never
}[keyof T];
