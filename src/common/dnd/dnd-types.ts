/**
 * @fileoverview Module `src/common/dnd/dnd-types.ts` providing dnd types definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd-types.ts`，提供拖放类型列表相关的定义与实现。
 */


/**
 * Type alias `DropEffect` representing drop effect (`"move" | "copy" | "link" | "none"`).
 * @zh 类型别名 `DropEffect`，表示放置副作用（`"move" | "copy" | "link" | "none"`）。
 */
export type DropEffect = "move" | "copy" | "link" | "none";

/**
 * Type alias `EffectAllowed` representing effect allowed (`DropEffect | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitial...`).
 * @zh 类型别名 `EffectAllowed`，表示副作用允许的（`DropEffect | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitial...`）。
 */
export type EffectAllowed = DropEffect | "copyMove" | "copyLink" | "linkMove" | "all" | "uninitialized";
