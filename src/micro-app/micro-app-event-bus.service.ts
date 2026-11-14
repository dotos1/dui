/**
 * @fileoverview Module `src/micro-app/micro-app-event-bus.service.ts` providing cross-framework event bus `DuiMicroAppEventBus`.
 * @zh 模块文件 `src/micro-app/micro-app-event-bus.service.ts`，提供类型安全且桥接浏览器 `CustomEvent('dui:micro-app-event')` 的跨框架事件总线。
 */

import { Injectable, OnDestroy } from '@angular/core';
import { DuiMicroAppEventPayload } from './micro-app.types';

/**
 * Browser `CustomEvent` name used to bridge events with standalone React/Vue/ESM micro-apps.
 * @zh 与外部独立打包的 React/Vue/ESM 微服务互通的浏览器 `CustomEvent` 事件名常量。
 */
export const DUI_MICRO_APP_CUSTOM_EVENT = 'dui:micro-app-event';

type InternalTopicHandler = (payload: unknown) => void;
type InternalWildcardHandler = (event: { topic: string; payload: unknown }) => void;

function isEventDetailRecord(value: unknown): value is DuiMicroAppEventPayload<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate['topic'] === 'string';
}

/**
 * Root-provided cross-framework event bus bridging Angular DI consumers and browser `CustomEvent('dui:micro-app-event')`.
 * @zh 根注入器单例跨框架事件总线，支持 `emit`/`on`/`clear` 并双向桥接浏览器 `CustomEvent('dui:micro-app-event')`。
 */
@Injectable({ providedIn: 'root' })
export class DuiMicroAppEventBus implements OnDestroy {
  private readonly _instanceId: string = `dui-bus-${Math.random().toString(36).slice(2, 11)}`;
  private readonly _listeners: Map<string, Set<InternalTopicHandler>> = new Map<
    string,
    Set<InternalTopicHandler>
  >();
  private readonly _wildcardListeners: Set<InternalWildcardHandler> =
    new Set<InternalWildcardHandler>();
  private readonly _boundWindowHandler: ((event: Event) => void) | null;

  /**
   * Initializes DOM `CustomEvent('dui:micro-app-event')` listener when running in a browser environment.
   * @zh 在浏览器环境下初始化 `window` 上的 `CustomEvent('dui:micro-app-event')` 监听器。
   */
  constructor() {
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      this._boundWindowHandler = (event: Event): void => {
        if (!(event instanceof CustomEvent)) {
          return;
        }
        const detail: unknown = event.detail;
        if (!isEventDetailRecord(detail)) {
          return;
        }
        if (detail.sourceId === this._instanceId) {
          return;
        }
        this._dispatchLocal(detail.topic, detail.payload);
      };
      window.addEventListener(DUI_MICRO_APP_CUSTOM_EVENT, this._boundWindowHandler);
    } else {
      this._boundWindowHandler = null;
    }
  }

  /**
   * Emits a typed event to all local subscribers and dispatches `CustomEvent('dui:micro-app-event')` on `window`.
   * @zh 向所有本地订阅者发送事件，并在 `window` 上派发 `CustomEvent('dui:micro-app-event')` 以通知外部框架微应用。
   * @param topic - Event topic name (`string`) / 事件主题名（`string`）
   * @param payload - Event payload (`TPayload`) / 事件负载数据（`TPayload`）
   */
  public emit<TPayload = unknown>(topic: string, payload: TPayload): void {
    this._dispatchLocal(topic, payload);
    if (
      typeof window !== 'undefined' &&
      typeof window.dispatchEvent === 'function' &&
      typeof CustomEvent === 'function'
    ) {
      const detail: DuiMicroAppEventPayload<TPayload> = {
        topic,
        payload,
        sourceId: this._instanceId,
      };
      window.dispatchEvent(new CustomEvent(DUI_MICRO_APP_CUSTOM_EVENT, { detail }));
    }
  }

  /**
   * Subscribes to a specific event topic and returns an unsubscribe disposer function.
   * @zh 订阅指定主题事件，并返回取消订阅的清理函数。
   * @param topic - Event topic name (`string`) / 事件主题名（`string`）
   * @param handler - Callback receiving typed payload (`(payload: TPayload) => void`) / 事件处理回调
   * @returns Unsubscribe function (`() => void`) / 取消订阅函数
   */
  public on<TPayload = unknown>(
    topic: string,
    handler: (payload: TPayload) => void,
  ): () => void {
    let bucket = this._listeners.get(topic);
    if (!bucket) {
      bucket = new Set<InternalTopicHandler>();
      this._listeners.set(topic, bucket);
    }
    const wrapped: InternalTopicHandler = (rawPayload: unknown): void => {
      handler(rawPayload as TPayload);
    };
    bucket.add(wrapped);
    return (): void => {
      const current = this._listeners.get(topic);
      if (!current) {
        return;
      }
      current.delete(wrapped);
      if (current.size === 0) {
        this._listeners.delete(topic);
      }
    };
  }

  /**
   * Subscribes to all topics passing through this event bus.
   * @zh 订阅流经事件总线的全部主题事件（供 `<dui-micro-app>` 转发 `microEvent` 输出使用）。
   * @param handler - Wildcard callback (`(event: { topic: string; payload: unknown }) => void`) / 通配回调
   * @returns Unsubscribe function (`() => void`) / 取消订阅函数
   */
  public onAny(handler: (event: { topic: string; payload: unknown }) => void): () => void {
    this._wildcardListeners.add(handler);
    return (): void => {
      this._wildcardListeners.delete(handler);
    };
  }

  /**
   * Clears all registered topic and wildcard listeners.
   * @zh 清空当前已注册的全部主题监听器与通配监听器。
   */
  public clear(): void {
    this._listeners.clear();
    this._wildcardListeners.clear();
  }

  /**
   * Removes window event listener and clears subscribers on service destruction.
   * @zh 服务销毁时移除 `window` 事件监听并清空全部订阅者。
   */
  public ngOnDestroy(): void {
    if (
      this._boundWindowHandler &&
      typeof window !== 'undefined' &&
      typeof window.removeEventListener === 'function'
    ) {
      window.removeEventListener(DUI_MICRO_APP_CUSTOM_EVENT, this._boundWindowHandler);
    }
    this.clear();
  }

  private _dispatchLocal(topic: string, payload: unknown): void {
    const bucket = this._listeners.get(topic);
    if (bucket) {
      for (const listener of Array.from(bucket)) {
        listener(payload);
      }
    }
    if (this._wildcardListeners.size > 0) {
      const snapshot = { topic, payload };
      for (const wildcard of Array.from(this._wildcardListeners)) {
        wildcard(snapshot);
      }
    }
  }
}
