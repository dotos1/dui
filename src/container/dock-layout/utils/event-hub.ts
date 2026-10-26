/**
 * @fileoverview Module `src/container/dock-layout/utils/event-hub.ts` providing event hub definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/event-hub.ts`，提供事件hub相关的定义与实现。
 */

import { UnexpectedNullError } from '../errors/internal-error';
import { LayoutManager } from '../layout-manager';
import { EventEmitter } from './event-emitter';

// Add our ChildEvent to WindowEventMap for type safety
/** @public */
declare global {
    /**
     * Interface `WindowEventMap` defining the contract and properties for window event map.
     * @zh 接口 `WindowEventMap`，定义窗口事件映射表的数据结构契约与属性规范。
     */
    interface WindowEventMap {
        /**
         * Property `[EventHub.ChildEventName]` (`CustomEvent<EventHub.ChildEventDetail>`) storing [event hub child event name].
         * @zh 属性 `[EventHub.ChildEventName]`（类型：`CustomEvent<EventHub.ChildEventDetail>`），用于存储或配置[EventHub子级事件Name]。
         */
        [EventHub.ChildEventName]: CustomEvent<EventHub.ChildEventDetail>;
    }
}

/**
 * An EventEmitter singleton that propagates events
 * across multiple windows. This is a little bit trickier since
 * windows are allowed to open childWindows in their own right.
 *
 * This means that we deal with a tree of windows. Therefore, we do the event propagation in two phases:
 *
 * - Propagate events from this layout to the parent layout
 *   - Repeat until the event arrived at the root layout
 * - Propagate events to this layout and to all children
 *   - Repeat until all layouts got the event
 *
 * **WARNING**: Only userBroadcast events are propagated between windows.
 * This means the you have to take care of propagating state changes between windows yourself.
 *
 * @public

 * @zh 类 `EventHub`，封装 `src/container/dock-layout/utils` 中的事件Hub数据结构与处理逻辑。
 */
export class EventHub extends EventEmitter {

    /**
     * Property `_childEventListener` (`any`) storing child event listener.
     * @internal
     * @zh 属性 `_childEventListener`（类型：`any`），用于存储或配置子级事件监听器。
     */
    private _childEventListener = (childEvent: CustomEvent<EventHub.ChildEventDetail>) => this.onEventFromChild(childEvent);

    /**
     * Creates a new EventHub instance
     * @param _layoutManager - the layout manager to synchronize between the windows
     * @internal

     * @zh 创建 `EventHub` 实例，并初始化其依赖项与内部状态。
     */
    constructor(
        /** @internal */
        private _layoutManager: LayoutManager
    ) {
        super();
        globalThis.addEventListener(EventHub.ChildEventName, this._childEventListener, { passive: true });
    }

    /**
     * Emit an event and notify listeners
     *
     * @param eventName - The name of the event
     * @param args - Additional arguments that will be passed to the listener
     * @public

     * @zh 执行 `emit`，用于发出。
     */
    override emit<K extends keyof EventEmitter.EventParamsMap>(eventName: K, ...args: EventEmitter.EventParamsMap[K]): void {
        if (eventName === 'userBroadcast') {
            // Explicitly redirect the user broadcast to our overridden method.
            this.emitUserBroadcast(...args);
        } else {
            super.emit(eventName, ...args);
        }
    }

    /**
     * Broadcasts a message to all other currently opened windows.
     * @public

     * @zh 执行 `emitUserBroadcast`，用于发出用户广播。
     */
    emitUserBroadcast(...args: EventEmitter.UnknownParams): void {
        // Step 1: Bubble up the event
        this.handleUserBroadcastEvent('userBroadcast', args);
    }

    /**
     * Destroys the EventHub
     * @internal

     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        globalThis.removeEventListener(EventHub.ChildEventName, this._childEventListener);
    }

    /**
     * Internal processor to process local events.
     * @internal

     * @zh 执行 `handleUserBroadcastEvent`，用于连接手柄用户广播事件。
     */
    private handleUserBroadcastEvent(eventName: string, args: unknown[]) {
        if (this._layoutManager.isSubWindow) {
            // We are a sub window and received an event from one of our children.
            // So propagate it to the Root.
            this.propagateToParent(eventName, args);
        } else {
            // We are the root window, propagate it to the subtree below us.
            this.propagateToThisAndSubtree(eventName, args);
        }
    }

    /**
     * Callback for child events raised on the window
     * @internal

     * @zh 执行 `onEventFromChild`，用于当事件从子级。
     */
    private onEventFromChild(event: CustomEvent<EventHub.ChildEventDetail>) {
        const detail = event.detail;
        this.handleUserBroadcastEvent(detail.eventName, detail.args);
    }

    /**
     * Propagates the event to the parent by emitting
     * it on the parent's DOM window
     * @internal

     * @zh 执行 `propagateToParent`，用于propagate转换为父级。
     */
    private propagateToParent(eventName: string, args: unknown[]) {
        const detail: EventHub.ChildEventDetail = {
            layoutManager: this._layoutManager,
            eventName,
            args: args,
        }

        const eventInit: EventHub.ChildEventInit = {
            bubbles: true,
            cancelable: true,
            detail,
        };

        const event = new CustomEvent<EventHub.ChildEventDetail>(EventHub.ChildEventName, eventInit);
        const opener = globalThis.opener;
        if (opener === null) {
            throw new UnexpectedNullError('EHPTP15778')
        }

        opener.dispatchEvent(event);
    }

    /**
     * Propagate events to the whole subtree under this event hub.
     * @internal

     * @zh 执行 `propagateToThisAndSubtree`，用于propagate转换为ThisAndSubtree。
     */
    private propagateToThisAndSubtree(eventName: string, args: unknown[]) {
        this.emitUnknown(eventName, ...args);
        for (let i = 0; i < this._layoutManager.openPopouts.length; i++) {
            const childGl = this._layoutManager.openPopouts[i].getGlInstance();

            if (childGl) {
                childGl.eventHub.propagateToThisAndSubtree(eventName, args);
            }
        }
    }
}

/** @public */
export namespace EventHub {

    /**
     * Constant/variable `ChildEventName` defining child event name in `src/container/dock-layout/utils`.
     * @internal
     * @zh 常量/变量 `ChildEventName`，定义 `src/container/dock-layout/utils` 中的子级事件名称。
     */
    export const ChildEventName = 'gl_child_event';

    /**
     * Type alias `ChildEventDetail` representing child event detail (`{ layoutManager: LayoutManager; eventName: string; args: unknown[]; }`).
     * @internal
     * @zh 类型别名 `ChildEventDetail`，表示子级事件详情（`{ layoutManager: LayoutManager; eventName: string; args: unknown[]; }`）。
     */
    export type ChildEventDetail = {
        /**
         * Property `layoutManager` (`LayoutManager`) storing layout manager.
         * @zh 属性 `layoutManager`（类型：`LayoutManager`），用于存储或配置布局管理器。
         */
        layoutManager: LayoutManager;
        /**
         * Property `eventName` (`string`) storing event name.
         * @zh 属性 `eventName`（类型：`string`），用于存储或配置事件名称。
         */
        eventName: string;
        /**
         * Property `args` (`unknown[]`) storing args.
         * @zh 属性 `args`（类型：`unknown[]`），用于存储或配置参数列表。
         */
        args: unknown[];
    };

    /**
     * Type alias `ChildEventInit` representing child event init (`CustomEventInit<ChildEventDetail>`).
     * @internal
     * @zh 类型别名 `ChildEventInit`，表示子级事件初始化（`CustomEventInit<ChildEventDetail>`）。
     */
    export type ChildEventInit = CustomEventInit<ChildEventDetail>;
}
