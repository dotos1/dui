/**
 * @fileoverview Module `src/ux/windows/core/types/raw-object.type.ts` providing raw object type definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/types/raw-object.type.ts`，提供原始对象类型相关的定义与实现。
 */


/**
 * Type alias `ɵRawObject` representing ɵraw object (`{ [key: string]: T; }`).
 * @zh 类型别名 `ɵRawObject`，表示ɵRaw对象（`{ [key: string]: T; }`）。
 */
export type ɵRawObject<T> = {
    [key: string]: T;
}
