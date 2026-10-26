/**
 * @fileoverview Module `src/ux/windows/core/types/inverted-keys-of.type.ts` providing inverted keys of type definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/types/inverted-keys-of.type.ts`，提供inverted键列表的类型相关的定义与实现。
 */


/**
 * Type alias `ɵInvertedKeysOfType` representing ɵinverted keys of type (`{ [K in keyof T as T[K] extends U ? never : K]: T[K] }`).
 * @zh 类型别名 `ɵInvertedKeysOfType`，表示ɵInverted键列表的类型（`{ [K in keyof T as T[K] extends U ? never : K]: T[K] }`）。
 */
export type ɵInvertedKeysOfType<T, U> = {
    [K in keyof T as T[K] extends U ? never : K]: T[K]
}
