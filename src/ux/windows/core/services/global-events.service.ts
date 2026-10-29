/**
 * @fileoverview Module `src/ux/windows/core/services/global-events.service.ts` providing global events service definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/services/global-events.service.ts`，提供全局事件集合服务相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';


/**
 * Injectable Angular service `ɵGlobalEvents` managing ɵglobal events state and operations in `src/ux/windows/core/services`.
 * @zh 可注入的 Angular 服务 `ɵGlobalEvents`，管理 `src/ux/windows/core/services` 中的ɵGlobal事件集合状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class ɵGlobalEvents {
    /**
     * Property `documentEventMap` (`Map<string, Subject<Event>>`) storing document event map (default: `new Map<string, Subject<Event>>()`).
     * @zh 属性 `documentEventMap`（类型：`Map<string, Subject<Event>>`），用于存储或配置文档对象事件映射表（默认值：`new Map<string, Subject<Event>>()`）。
     */
    private documentEventMap = new Map<string, Subject<Event>>();
    /**
     * Property `documentEventListeners` (`Map<string, EventListener>`) storing document event listeners (default: `new Map<string, EventListener>()`).
     * @zh 属性 `documentEventListeners`（类型：`Map<string, EventListener>`），用于存储或配置文档对象事件监听器列表（默认值：`new Map<string, EventListener>()`）。
     */
    private documentEventListeners = new Map<string, EventListener>();
    /**
     * Property `documentEventRefCounts` (`Map<string, number>`) storing document event ref counts (default: `new Map<string, number>()`).
     * @zh 属性 `documentEventRefCounts`（类型：`Map<string, number>`），用于存储或配置文档对象事件引用计数（默认值：`new Map<string, number>()`）。
     */
    private documentEventRefCounts = new Map<string, number>();

    /**
     * Creates an instance of `ɵGlobalEvents` and initializes its dependencies and internal state.
     * @zh 创建 `ɵGlobalEvents` 实例，并初始化其依赖项与内部状态。
     * @param document - Injected or initial document (`Document`) / 注入或传入的文档对象（`Document`）
     */
    constructor(
        @Inject(DOCUMENT) private readonly document: Document
    ) {}

    /**
     * Executes `fromDocument` to handle from document.
     * @zh 执行 `fromDocument`，用于从文档对象。
     * @param eventName - event name parameter (`keyof DocumentEventMap`) / 事件名称参数（`keyof DocumentEventMap`）
     * @returns Result of type `Observable<T>` / 类型为 `Observable<T>` 的返回值
     */
    public fromDocument<T extends Event>(eventName: keyof DocumentEventMap): Observable<T> {
        return defer(() => {
            if (!this.documentEventMap.has(eventName)) {
                const emitter = new Subject<Event>();
                const listener: EventListener = (event) => emitter.next(event);

                this.document.addEventListener(eventName, listener);
                this.documentEventListeners.set(eventName, listener);
                this.documentEventRefCounts.set(eventName, 0);
                this.documentEventMap.set(eventName, emitter);
            }

            this.documentEventRefCounts.set(eventName, (this.documentEventRefCounts.get(eventName) || 0) + 1);
            const emitter = this.documentEventMap.get(eventName)!;

            return emitter.asObservable().pipe(
                finalize(() => {
                    const remaining = (this.documentEventRefCounts.get(eventName) || 1) - 1;
                    if (remaining <= 0) {
                        const savedListener = this.documentEventListeners.get(eventName);
                        if (savedListener) {
                            this.document.removeEventListener(eventName, savedListener);
                        }
                        this.documentEventMap.delete(eventName);
                        this.documentEventListeners.delete(eventName);
                        this.documentEventRefCounts.delete(eventName);
                    } else {
                        this.documentEventRefCounts.set(eventName, remaining);
                    }
                })
            ) as Observable<T>;
        });
    }
}
