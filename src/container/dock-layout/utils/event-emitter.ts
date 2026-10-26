/**
 * @fileoverview Module `src/container/dock-layout/utils/event-emitter.ts` providing event emitter definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/event-emitter.ts`，提供事件发射器相关的定义与实现。
 */

import { BrowserPopout } from '../controls/browser-popout';
import { Tab } from '../controls/tab';
import { ComponentItem } from '../items/component-item';


/**
 * Class `EventEmitter` encapsulating event emitter data structures and logic in `src/container/dock-layout/utils`.
 * @zh 类 `EventEmitter`，封装 `src/container/dock-layout/utils` 中的事件发射器数据结构与处理逻辑。
 */
export class EventEmitter {
    /**
     * Property `_allEventSubscriptions` (`EventEmitter.UnknownCallback[]`) storing all event subscriptions (default: `[]`).
     * @internal
     * @zh 属性 `_allEventSubscriptions`（类型：`EventEmitter.UnknownCallback[]`），用于存储或配置全部事件订阅集合（默认值：`[]`）。
     */
    private _allEventSubscriptions: EventEmitter.UnknownCallback[] = [];
    /**
     * Property `_subscriptionsMap` (`Map`) storing subscriptions map.
     * @internal
     * @zh 属性 `_subscriptionsMap`（类型：`Map`），用于存储或配置订阅集合映射表。
     */
    private _subscriptionsMap = new Map<string, EventEmitter.UnknownCallback[]>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Executes `tryBubbleEvent` to handle try bubble event.
     * @zh 执行 `tryBubbleEvent`，用于tryBubble事件。
     * @param name - name parameter (`string`) / 名称参数（`string`）
     * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
     */
    tryBubbleEvent(name: string, args: unknown[]): void {
        // overridden by ContentItem
    }

    /**
     * Emit an event and notify listeners
     *
     * @param eventName - The name of the event
     * @param args - Additional arguments that will be passed to the listener

     * @zh 执行 `emit`，用于发出。
     */
    emit<K extends keyof EventEmitter.EventParamsMap>(eventName: K, ...args: EventEmitter.EventParamsMap[K]): void {
        let subcriptions = this._subscriptionsMap.get(eventName);

        if (subcriptions !== undefined) {
            subcriptions = subcriptions.slice();
            for (let i = 0; i < subcriptions.length; i++) {
                const subscription = subcriptions[i];
                subscription(...args);
            }
        }

        this.emitAllEvent(eventName, args);
        this.tryBubbleEvent(eventName, args);
    }

    /**
     * Executes `emitUnknown` to handle emit unknown.
     * @internal
     * @zh 执行 `emitUnknown`，用于发出未知类型。
     */
    emitUnknown(eventName: string, ...args: EventEmitter.UnknownParams): void {
        let subs = this._subscriptionsMap.get(eventName);

        if (subs !== undefined) {
            subs = subs.slice();
            for (let i = 0; i < subs.length; i++) {
                subs[i](...args);
            }
        }

        this.emitAllEvent(eventName, args);
        this.tryBubbleEvent(eventName, args);
    }

    /* @internal **/
    /**
     * Executes `emitBaseBubblingEvent` to handle emit base bubbling event.
     * @zh 执行 `emitBaseBubblingEvent`，用于发出基础Bubbling事件。
     * @param eventName - event name parameter (`K`) / 事件名称参数（`K`）
     */
    emitBaseBubblingEvent<K extends keyof EventEmitter.EventParamsMap>(eventName: K): void {
        const event = new EventEmitter.BubblingEvent(eventName, this);
        this.emitUnknown(eventName, event);
    }

    /**
     * Executes `emitUnknownBubblingEvent` to handle emit unknown bubbling event.
     * @internal
     * @zh 执行 `emitUnknownBubblingEvent`，用于发出未知类型Bubbling事件。
     */
    emitUnknownBubblingEvent(eventName: string): void {
        const event = new EventEmitter.BubblingEvent(eventName, this);
        this.emitUnknown(eventName, event);
    }

    /**
     * Removes a listener for an event.
     * @param eventName - The name of the event
     * @param callback - The previously registered callback method (optional)

     * @zh 执行 `removeEventListener`，用于移除事件监听器。
     */
    removeEventListener<K extends keyof EventEmitter.EventParamsMap>(eventName: K, callback: EventEmitter.Callback<K>): void {
        const unknownCallback = callback as EventEmitter.UnknownCallback;
        this.removeUnknownEventListener(eventName, unknownCallback);
    }

    /**
     * Executes `off` to handle off.
     * @zh 执行 `off`，用于off。
     * @param eventName - event name parameter (`K`) / 事件名称参数（`K`）
     * @param callback - callback parameter (`EventEmitter.Callback<K>`) / 回调函数参数（`EventEmitter.Callback<K>`）
     */
    off<K extends keyof EventEmitter.EventParamsMap>(eventName: K, callback: EventEmitter.Callback<K>): void {
        this.removeEventListener(eventName, callback);
    }

    /**
     * Alias for off

     * @zh 属性 `unbind`（类型：`any`），用于存储或配置解绑（默认值：`this.removeEventListener`）。
     */
    unbind = this.removeEventListener;

    /**
     * Alias for emit

     * @zh 属性 `trigger`（类型：`any`），用于存储或配置触发（默认值：`this.emit`）。
     */
    trigger = this.emit;

    /**
     * Listen for events
     *
     * @param eventName - The name of the event to listen to
     * @param callback - The callback to execute when the event occurs

     * @zh 执行 `addEventListener`，用于添加事件监听器。
     */
    addEventListener<K extends keyof EventEmitter.EventParamsMap>(eventName: K, callback: EventEmitter.Callback<K>): void {
        const unknownCallback = callback as EventEmitter.UnknownCallback;
        this.addUnknownEventListener(eventName, unknownCallback);
    }

    /**
     * Executes `on` to handle on.
     * @zh 执行 `on`，用于当。
     * @param eventName - event name parameter (`K`) / 事件名称参数（`K`）
     * @param callback - callback parameter (`EventEmitter.Callback<K>`) / 回调函数参数（`EventEmitter.Callback<K>`）
     */
    on<K extends keyof EventEmitter.EventParamsMap>(eventName: K, callback: EventEmitter.Callback<K>): void {
        this.addEventListener(eventName, callback);
    }

    /**
     * Executes `addUnknownEventListener` to handle add unknown event listener.
     * @internal
     * @zh 执行 `addUnknownEventListener`，用于添加未知类型事件监听器。
     */
    private addUnknownEventListener(eventName: string, callback: EventEmitter.UnknownCallback): void {
        if (eventName === EventEmitter.ALL_EVENT) {
            this._allEventSubscriptions.push(callback);
        } else {
            let subscriptions = this._subscriptionsMap.get(eventName);
            if (subscriptions !== undefined) {
                subscriptions.push(callback);
            } else {
                subscriptions = [callback];
                this._subscriptionsMap.set(eventName, subscriptions);
            }
        }
    }

    /**
     * Executes `removeUnknownEventListener` to handle remove unknown event listener.
     * @internal
     * @zh 执行 `removeUnknownEventListener`，用于移除未知类型事件监听器。
     */
    private removeUnknownEventListener(eventName: string, callback: EventEmitter.UnknownCallback): void {
        if (eventName === EventEmitter.ALL_EVENT) {
            this.removeSubscription(eventName, this._allEventSubscriptions, callback);
        } else {
            const subscriptions = this._subscriptionsMap.get(eventName);
            if (subscriptions === undefined) {
                throw new Error('No subscribtions to unsubscribe for event ' + eventName);
            } else {
                this.removeSubscription(eventName, subscriptions, callback);
            }
        }
    }

    /**
     * Executes `removeSubscription` to handle remove subscription.
     * @internal
     * @zh 执行 `removeSubscription`，用于移除订阅对象。
     */
    private removeSubscription(eventName: string, subscriptions: EventEmitter.UnknownCallback[], callback: EventEmitter.UnknownCallback) {
        const idx = subscriptions.indexOf(callback);
        if (idx < 0) {
            throw new Error('Nothing to unbind for ' + eventName);
        } else {
            subscriptions.splice(idx, 1);
        }
    }

    /**
     * Executes `emitAllEvent` to handle emit all event.
     * @internal
     * @zh 执行 `emitAllEvent`，用于发出全部事件。
     */
    private emitAllEvent(eventName: string, args: unknown[]) {
        const allEventSubscriptionsCount = this._allEventSubscriptions.length;
        if (allEventSubscriptionsCount > 0) {
            const unknownArgs = args.slice() as EventEmitter.UnknownParams;
            unknownArgs.unshift(eventName);

            const allEventSubcriptions = this._allEventSubscriptions.slice();

            for (let i = 0; i < allEventSubscriptionsCount; i++) {
                allEventSubcriptions[i](...unknownArgs);
            }
        }
    }
}

/** @public */
export namespace EventEmitter {
    /**
     * The name of the event that's triggered for every event

     * @zh 常量/变量 `ALL_EVENT`，定义 `src/container/dock-layout/utils` 中的全部事件。
     */
    export const ALL_EVENT = '__all';

    /**
     * Constant/variable `headerClickEventName` defining header click event name in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `headerClickEventName`，定义 `src/container/dock-layout/utils` 中的表头点击事件名称。
     */
    export const headerClickEventName = 'stackHeaderClick';
    /**
     * Constant/variable `headerTouchStartEventName` defining header touch start event name in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `headerTouchStartEventName`，定义 `src/container/dock-layout/utils` 中的表头触摸开始事件名称。
     */
    export const headerTouchStartEventName = 'stackHeaderTouchStart';
    /**
     * Constant/variable `contentClickEventName` defining content click event name in `src/container/dock-layout/utils`.
     * @zh 常量/变量 `contentClickEventName`，定义 `src/container/dock-layout/utils` 中的内容点击事件名称。
     */
    export const contentClickEventName= 'stackContentClick';

    /**
     * Type alias `UnknownCallback` representing unknown callback (`(this: void, ...args: UnknownParams) => void`).
     * @internal
     * @zh 类型别名 `UnknownCallback`，表示未知类型回调函数（`(this: void, ...args: UnknownParams) => void`）。
     */
    export type UnknownCallback = (this: void, ...args: UnknownParams) => void;
    /**
     * Type alias `Callback` representing callback (`(this: void, ...args: EventParamsMap[K]) => void`).
     * @zh 类型别名 `Callback`，表示回调函数（`(this: void, ...args: EventParamsMap[K]) => void`）。
     */
    export type Callback<K extends keyof EventEmitter.EventParamsMap> = (this: void, ...args: EventParamsMap[K]) => void;

    /**
     * Interface `EventParamsMap` defining the contract and properties for event params map.
     * @zh 接口 `EventParamsMap`，定义事件参数集合映射表的数据结构契约与属性规范。
     */
    export interface EventParamsMap {
        /**
         * Property `__all` (`UnknownParams`) storing all.
         * @zh 属性 `__all`（类型：`UnknownParams`），用于存储或配置全部。
         */
        "__all": UnknownParams;
        /**
         * Property `activeContentItemChanged` (`ComponentItemParam`) storing active content item changed.
         * @zh 属性 `activeContentItemChanged`（类型：`ComponentItemParam`），用于存储或配置激活内容条目已变更。
         */
        "activeContentItemChanged": ComponentItemParam;
        /**
         * Property `close` (`NoParams`) storing close.
         * @zh 属性 `close`（类型：`NoParams`），用于存储或配置关闭。
         */
        "close": NoParams;
        /**
         * Property `closed` (`NoParams`) storing closed.
         * @zh 属性 `closed`（类型：`NoParams`），用于存储或配置是否关闭。
         */
        "closed": NoParams;
        /**
         * Property `destroy` (`NoParams`) storing destroy.
         * @zh 属性 `destroy`（类型：`NoParams`），用于存储或配置销毁。
         */
        "destroy": NoParams;
        /**
         * Property `drag` (`DragParams`) storing drag.
         * @zh 属性 `drag`（类型：`DragParams`），用于存储或配置拖拽。
         */
        "drag": DragParams;
        /**
         * Property `dragStart` (`DragStartParams`) storing drag start.
         * @zh 属性 `dragStart`（类型：`DragStartParams`），用于存储或配置拖拽开始。
         */
        "dragStart": DragStartParams;
        /**
         * Property `dragStop` (`DragStopParams`) storing drag stop.
         * @zh 属性 `dragStop`（类型：`DragStopParams`），用于存储或配置拖拽停止。
         */
        "dragStop": DragStopParams;
        /**
         * Property `hide` (`NoParams`) storing hide.
         * @zh 属性 `hide`（类型：`NoParams`），用于存储或配置隐藏。
         */
        "hide": NoParams;
        /**
         * Property `initialised` (`NoParams`) storing initialised.
         * @zh 属性 `initialised`（类型：`NoParams`），用于存储或配置initialised。
         */
        "initialised": NoParams;
        /**
         * Property `itemDropped` (`ComponentItemParam`) storing item dropped.
         * @zh 属性 `itemDropped`（类型：`ComponentItemParam`），用于存储或配置条目Dropped。
         */
        "itemDropped": ComponentItemParam;
        /**
         * Property `maximised` (`NoParams`) storing maximised.
         * @zh 属性 `maximised`（类型：`NoParams`），用于存储或配置最大化。
         */
        "maximised": NoParams;
        /**
         * Property `minimised` (`NoParams`) storing minimised.
         * @zh 属性 `minimised`（类型：`NoParams`），用于存储或配置最小化。
         */
        "minimised": NoParams;
        /**
         * Property `open` (`NoParams`) storing open.
         * @zh 属性 `open`（类型：`NoParams`），用于存储或配置打开。
         */
        "open": NoParams;
        /**
         * Property `popIn` (`NoParams`) storing pop in.
         * @zh 属性 `popIn`（类型：`NoParams`），用于存储或配置弹出在。
         */
        "popIn": NoParams;
        /**
         * Property `resize` (`NoParams`) storing resize.
         * @zh 属性 `resize`（类型：`NoParams`），用于存储或配置调整尺寸。
         */
        "resize": NoParams;
        /**
         * Property `show` (`NoParams`) storing show.
         * @zh 属性 `show`（类型：`NoParams`），用于存储或配置显示。
         */
        "show": NoParams;
        /**
         * Property `shown` (`NoParams`) storing shown.
         * @zh 属性 `shown`（类型：`NoParams`），用于存储或配置已显示。
         */
        "shown": NoParams;
        /**
         * Property `stateChanged` (`NoParams`) storing state changed.
         * @zh 属性 `stateChanged`（类型：`NoParams`），用于存储或配置状态已变更。
         */
        "stateChanged": NoParams;
        /**
         * Property `tab` (`TabParam`) storing tab.
         * @zh 属性 `tab`（类型：`TabParam`），用于存储或配置选项卡。
         */
        "tab": TabParam;
        /**
         * Property `tabCreated` (`TabParam`) storing tab created.
         * @zh 属性 `tabCreated`（类型：`TabParam`），用于存储或配置选项卡已创建。
         */
        "tabCreated": TabParam;
        /**
         * Property `tabRemoved` (`TabParam`) storing tab removed.
         * @zh 属性 `tabRemoved`（类型：`TabParam`），用于存储或配置选项卡已移除。
         */
        "tabRemoved":TabParam;
        /**
         * Property `titleChanged` (`StringParam`) storing title changed.
         * @zh 属性 `titleChanged`（类型：`StringParam`），用于存储或配置标题已变更。
         */
        "titleChanged": StringParam;
        /**
         * Property `windowClosed` (`PopoutParam`) storing window closed.
         * @zh 属性 `windowClosed`（类型：`PopoutParam`），用于存储或配置窗口是否关闭。
         */
        "windowClosed": PopoutParam;
        /**
         * Property `windowOpened` (`PopoutParam`) storing window opened.
         * @zh 属性 `windowOpened`（类型：`PopoutParam`），用于存储或配置窗口是否展开。
         */
        "windowOpened": PopoutParam;
        /**
         * Property `beforeComponentRelease` (`BeforeComponentReleaseParams`) storing before component release.
         * @zh 属性 `beforeComponentRelease`（类型：`BeforeComponentReleaseParams`），用于存储或配置之前组件Release。
         */
        "beforeComponentRelease": BeforeComponentReleaseParams;
        /**
         * Property `beforeItemDestroyed` (`BubblingEventParam`) storing before item destroyed.
         * @zh 属性 `beforeItemDestroyed`（类型：`BubblingEventParam`），用于存储或配置之前条目已销毁。
         */
        "beforeItemDestroyed": BubblingEventParam;
        /**
         * Property `itemCreated` (`BubblingEventParam`) storing item created.
         * @zh 属性 `itemCreated`（类型：`BubblingEventParam`），用于存储或配置条目已创建。
         */
        "itemCreated": BubblingEventParam;
        /**
         * Property `itemDestroyed` (`BubblingEventParam`) storing item destroyed.
         * @zh 属性 `itemDestroyed`（类型：`BubblingEventParam`），用于存储或配置条目已销毁。
         */
        "itemDestroyed": BubblingEventParam;
        /**
         * Property `focus` (`BubblingEventParam`) storing focus.
         * @zh 属性 `focus`（类型：`BubblingEventParam`），用于存储或配置聚焦。
         */
        "focus": BubblingEventParam;
        /**
         * Property `blur` (`BubblingEventParam`) storing blur.
         * @zh 属性 `blur`（类型：`BubblingEventParam`），用于存储或配置失焦。
         */
        "blur": BubblingEventParam;
        /**
         * Property `stackHeaderClick` (`ClickBubblingEventParam`) storing stack header click.
         * @zh 属性 `stackHeaderClick`（类型：`ClickBubblingEventParam`），用于存储或配置栈表头点击。
         */
        "stackHeaderClick": ClickBubblingEventParam;
        /**
         * Property `stackContentClick` (`ClickBubblingEventParam`) storing stack content click.
         * @zh 属性 `stackContentClick`（类型：`ClickBubblingEventParam`），用于存储或配置栈内容点击。
         */
        "stackContentClick": ClickBubblingEventParam;
        /**
         * Property `stackHeaderTouchStart` (`TouchStartBubblingEventParam`) storing stack header touch start.
         * @zh 属性 `stackHeaderTouchStart`（类型：`TouchStartBubblingEventParam`），用于存储或配置栈表头触摸开始。
         */
        "stackHeaderTouchStart": TouchStartBubblingEventParam;
        /**
         * Property `userBroadcast` (`UnknownParams`) storing user broadcast.
         * @zh 属性 `userBroadcast`（类型：`UnknownParams`），用于存储或配置用户广播。
         */
        "userBroadcast": UnknownParams;
    }

    /**
     * Type alias `UnknownParams` representing unknown params (`unknown[]`).
     * @zh 类型别名 `UnknownParams`，表示未知类型参数集合（`unknown[]`）。
     */
    export type UnknownParams = unknown[];
    /**
     * Type alias `NoParams` representing no params (`[]`).
     * @zh 类型别名 `NoParams`，表示No参数集合（`[]`）。
     */
    export type NoParams = [];
    /**
     * Type alias `UnknownParam` representing unknown param (`[unknown]`).
     * @zh 类型别名 `UnknownParam`，表示未知类型参数（`[unknown]`）。
     */
    export type UnknownParam = [unknown];
    /**
     * Type alias `PopoutParam` representing popout param (`[BrowserPopout]`).
     * @zh 类型别名 `PopoutParam`，表示弹出窗口参数（`[BrowserPopout]`）。
     */
    export type PopoutParam = [BrowserPopout];
    /**
     * Type alias `ComponentItemParam` representing component item param (`[ComponentItem]`).
     * @zh 类型别名 `ComponentItemParam`，表示组件条目参数（`[ComponentItem]`）。
     */
    export type ComponentItemParam = [ComponentItem];
    /**
     * Type alias `TabParam` representing tab param (`[Tab]`).
     * @zh 类型别名 `TabParam`，表示选项卡参数（`[Tab]`）。
     */
    export type TabParam = [Tab];
    /**
     * Type alias `BubblingEventParam` representing bubbling event param (`[EventEmitter.BubblingEvent]`).
     * @zh 类型别名 `BubblingEventParam`，表示Bubbling事件参数（`[EventEmitter.BubblingEvent]`）。
     */
    export type BubblingEventParam = [EventEmitter.BubblingEvent]
    /**
     * Type alias `StringParam` representing string param (`[string]`).
     * @zh 类型别名 `StringParam`，表示字符串参数（`[string]`）。
     */
    export type StringParam = [string];
    /**
     * Type alias `DragStartParams` representing drag start params (`[originalX: number, originalY: number]`).
     * @zh 类型别名 `DragStartParams`，表示拖拽开始参数集合（`[originalX: number, originalY: number]`）。
     */
    export type DragStartParams = [originalX: number, originalY: number];
    /**
     * Type alias `DragStopParams` representing drag stop params (`[event: PointerEvent | undefined]`).
     * @zh 类型别名 `DragStopParams`，表示拖拽停止参数集合（`[event: PointerEvent | undefined]`）。
     */
    export type DragStopParams = [event: PointerEvent | undefined];
    /**
     * Type alias `DragParams` representing drag params (`[offsetX: number, offsetY: number, event: PointerEvent]`).
     * @zh 类型别名 `DragParams`，表示拖拽参数集合（`[offsetX: number, offsetY: number, event: PointerEvent]`）。
     */
    export type DragParams = [offsetX: number, offsetY: number, event: PointerEvent];
    /**
     * Type alias `BeforeComponentReleaseParams` representing before component release params (`[component: unknown]`).
     * @zh 类型别名 `BeforeComponentReleaseParams`，表示之前组件Release参数集合（`[component: unknown]`）。
     */
    export type BeforeComponentReleaseParams = [component: unknown];
    /**
     * Type alias `ClickBubblingEventParam` representing click bubbling event param (`[ClickBubblingEvent]`).
     * @zh 类型别名 `ClickBubblingEventParam`，表示点击Bubbling事件参数（`[ClickBubblingEvent]`）。
     */
    export type ClickBubblingEventParam = [ClickBubblingEvent];
    /**
     * Type alias `TouchStartBubblingEventParam` representing touch start bubbling event param (`[TouchStartBubblingEvent]`).
     * @zh 类型别名 `TouchStartBubblingEventParam`，表示触摸开始Bubbling事件参数（`[TouchStartBubblingEvent]`）。
     */
    export type TouchStartBubblingEventParam = [TouchStartBubblingEvent];

    /**
     * Class `BubblingEvent` encapsulating bubbling event data structures and logic in `src/container/dock-layout/utils`.
     * @zh 类 `BubblingEvent`，封装 `src/container/dock-layout/utils` 中的Bubbling事件数据结构与处理逻辑。
     */
    export class BubblingEvent {
        /**
         * Property `_isPropagationStopped` (`boolean`) storing is propagation stopped (default: `false`).
         * @internal
         * @zh 属性 `_isPropagationStopped`（类型：`boolean`），用于存储或配置是否为事件冒泡Stopped（默认值：`false`）。
         */
        private _isPropagationStopped = false;

        /**
         * Gets the current name (`name: string`).
         * @zh 获取当前名称（`name: string`）。
         */
        get name(): string { return this._name; }
        /**
         * Gets the current target (`target: EventEmitter`).
         * @zh 获取当前目标（`target: EventEmitter`）。
         */
        get target(): EventEmitter { return this._target; }
        /**
         * @deprecated Use {@link (EventEmitter:namespace).(BubblingEvent:class).target} instead
         * @zh 获取当前origin（`origin: EventEmitter`）。
         */
        get origin(): EventEmitter { return this._target; }
        /**
         * Gets the current is propagation stopped (`isPropagationStopped: boolean`).
         * @zh 获取当前是否为事件冒泡Stopped（`isPropagationStopped: boolean`）。
         */
        get isPropagationStopped(): boolean { return this._isPropagationStopped; }

        /**
         * Creates an instance of `BubblingEvent` and initializes its dependencies and internal state.
         * @internal
         * @zh 创建 `BubblingEvent` 实例，并初始化其依赖项与内部状态。
         */
        constructor(
            /** @internal */
            private readonly _name: string,
            /** @internal */
            private readonly _target: EventEmitter) {
        }

        /**
         * Executes `stopPropagation` to handle stop propagation.
         * @zh 执行 `stopPropagation`，用于停止事件冒泡。
         */
        stopPropagation(): void {
            this._isPropagationStopped = true;
        }
    }

    /**
     * Class `ClickBubblingEvent` encapsulating click bubbling event data structures and logic in `src/container/dock-layout/utils`.
     * @zh 类 `ClickBubblingEvent`，封装 `src/container/dock-layout/utils` 中的点击Bubbling事件数据结构与处理逻辑。
     */
    export class ClickBubblingEvent extends BubblingEvent {
        /**
         * Gets the current mouse event (`mouseEvent: MouseEvent`).
         * @zh 获取当前鼠标事件（`mouseEvent: MouseEvent`）。
         */
        get mouseEvent(): MouseEvent { return this._mouseEvent; }

        /**
         * Creates an instance of `ClickBubblingEvent` and initializes its dependencies and internal state.
         * @internal
         * @zh 创建 `ClickBubblingEvent` 实例，并初始化其依赖项与内部状态。
         */
        constructor(name: string, target: EventEmitter,
            /** @internal */
            private readonly _mouseEvent: MouseEvent
        ) {
            super(name, target);
        }
    }

    /**
     * Class `TouchStartBubblingEvent` encapsulating touch start bubbling event data structures and logic in `src/container/dock-layout/utils`.
     * @zh 类 `TouchStartBubblingEvent`，封装 `src/container/dock-layout/utils` 中的触摸开始Bubbling事件数据结构与处理逻辑。
     */
    export class TouchStartBubblingEvent extends BubblingEvent {
        /**
         * Gets the current touch event (`touchEvent: TouchEvent`).
         * @zh 获取当前触摸事件（`touchEvent: TouchEvent`）。
         */
        get touchEvent(): TouchEvent { return this._touchEvent; }

        /**
         * Creates an instance of `TouchStartBubblingEvent` and initializes its dependencies and internal state.
         * @internal
         * @zh 创建 `TouchStartBubblingEvent` 实例，并初始化其依赖项与内部状态。
         */
        constructor(name: string, target: EventEmitter,
            /** @internal */
            private readonly _touchEvent: TouchEvent
        ) {
            super(name, target);
        }
    }
}
