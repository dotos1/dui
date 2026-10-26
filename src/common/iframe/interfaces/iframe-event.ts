/**
 * @fileoverview Module `src/common/iframe/interfaces/iframe-event.ts` providing iframe event definitions and implementation.
 * @zh 模块文件 `src/common/iframe/interfaces/iframe-event.ts`，提供iframe事件相关的定义与实现。
 */

/**
 * Interface `IframeEvent` defining the contract and properties for iframe event.
 * @zh 接口 `IframeEvent`，定义Iframe事件的数据结构契约与属性规范。
 */
export interface IframeEvent {
    /**
     * Property `event` (`IframeEventName`) storing event.
     * @zh 属性 `event`（类型：`IframeEventName`），用于存储或配置事件。
     */
    event: IframeEventName;
    /**
     * Property `src` (`string`) storing src.
     * @zh 属性 `src`（类型：`string`），用于存储或配置源路径。
     */
    src: string;
    /**
     * Property `resource` (`string`) storing resource.
     * @zh 属性 `resource`（类型：`string`），用于存储或配置资源。
     */
    resource?: string;
}
/**
 * Type alias `IframeEventName` representing iframe event name (`'iframe-click' | 'iframe-loaded' | 'iframe-loaded-with-errors' | 'ifra...`).
 * @zh 类型别名 `IframeEventName`，表示Iframe事件名称（`'iframe-click' | 'iframe-loaded' | 'iframe-loaded-with-errors' | 'ifra...`）。
 */
export type IframeEventName = 'iframe-click'
    | 'iframe-loaded'
    | 'iframe-loaded-with-errors'
    | 'iframe-unloaded'
    | 'iframe-styles-added'
    | 'iframe-stylesheet-load'
    | 'iframe-stylesheet-loaded'
    | 'iframe-all-stylesheets-loaded'
    | 'iframe-keyup'
    | 'iframe-resized';
