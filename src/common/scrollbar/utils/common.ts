/**
 * @fileoverview Module `src/common/scrollbar/utils/common.ts` providing common definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/utils/common.ts`，提供通用相关的定义与实现。
 */

import { MonoTypeOperatorFunction, Observable, tap, throttleTime } from 'rxjs';

/**
 * Executes `preventSelection` to handle prevent selection.
 * @zh 执行 `preventSelection`，用于阻止默认Selection。
 * @param doc - doc parameter (`Document`) / 文档参数（`Document`）
 * @returns Result of type `MonoTypeOperatorFunction<PointerEvent>` / 类型为 `MonoTypeOperatorFunction<PointerEvent>` 的返回值
 */
export function preventSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  return tap(() => doc.onselectstart = () => false);
}

/**
 * Executes `enableSelection` to handle enable selection.
 * @zh 执行 `enableSelection`，用于启用Selection。
 * @param doc - doc parameter (`Document`) / 文档参数（`Document`）
 * @returns Result of type `MonoTypeOperatorFunction<PointerEvent>` / 类型为 `MonoTypeOperatorFunction<PointerEvent>` 的返回值
 */
export function enableSelection(doc: Document): MonoTypeOperatorFunction<PointerEvent> {
  return tap(() => doc.onselectstart = null);
}

/**
 * Executes `stopPropagation` to handle stop propagation.
 * @zh 执行 `stopPropagation`，用于停止事件冒泡。
 * @returns Result of type `MonoTypeOperatorFunction<PointerEvent>` / 类型为 `MonoTypeOperatorFunction<PointerEvent>` 的返回值
 */
export function stopPropagation(): MonoTypeOperatorFunction<PointerEvent> {
  return tap((e: PointerEvent) => {
    // Have to prevent default to avoid unexpected movement whe you grab object beneath scrollbar #476
    // https://github.com/MurhafSousli/ngx-scrollbar/issues/476
    e.preventDefault();
    e.stopPropagation()
  });
}

/**
 * Executes `getThrottledStream` to handle get throttled stream.
 * @zh 执行 `getThrottledStream`，用于获取已节流流。
 * @param stream - stream parameter (`Observable<T>`) / 流参数（`Observable<T>`）
 * @param duration - duration parameter (`number`) / 持续时间参数（`number`）
 * @returns Result of type `Observable<T>` / 类型为 `Observable<T>` 的返回值
 */
export function getThrottledStream<T>(stream: Observable<T>, duration: number): Observable<T> {
  return stream.pipe(
    throttleTime(duration || 0, null, {
      leading: false,
      trailing: true
    })
  );
}

/**
 * Interface `ElementDimension` defining the contract and properties for element dimension.
 * @zh 接口 `ElementDimension`，定义元素维度的数据结构契约与属性规范。
 */
export interface ElementDimension {
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width?: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height?: number;
}

/**
 * Type alias `ScrollbarDragging` representing scrollbar dragging (`'x' | 'y' | 'none'`).
 * @zh 类型别名 `ScrollbarDragging`，表示滚动条拖拽中（`'x' | 'y' | 'none'`）。
 */
export type ScrollbarDragging = 'x' | 'y' | 'none';

/**
 * Enumeration `ViewportClasses` defining supported viewport classes constants.
 * @zh 枚举 `ViewportClasses`，定义支持的视口类名集合常量集合。
 */
export enum ViewportClasses {
  /**
   * Enum member `ViewportClasses.Viewport` = 'ng-scroll-viewport' representing viewport.
   * @zh 枚举项 `ViewportClasses.Viewport` = 'ng-scroll-viewport'，表示视口。
   */
  Viewport = 'ng-scroll-viewport',
  /**
   * Enum member `ViewportClasses.Content` = 'ng-scroll-content' representing content.
   * @zh 枚举项 `ViewportClasses.Content` = 'ng-scroll-content'，表示内容。
   */
  Content = 'ng-scroll-content',
  /**
   * Enum member `ViewportClasses.Spacer` = 'ng-scroll-spacer' representing spacer.
   * @zh 枚举项 `ViewportClasses.Spacer` = 'ng-scroll-spacer'，表示Spacer。
   */
  Spacer = 'ng-scroll-spacer'
}

/**
 * Interface `ViewportBoundaries` defining the contract and properties for viewport boundaries.
 * @zh 接口 `ViewportBoundaries`，定义视口Boundaries的数据结构契约与属性规范。
 */
export interface ViewportBoundaries {
  /**
   * Property `contentHeight` (`number`) storing content height.
   * @zh 属性 `contentHeight`（类型：`number`），用于存储或配置内容高度。
   */
  contentHeight: number;
  /**
   * Property `contentWidth` (`number`) storing content width.
   * @zh 属性 `contentWidth`（类型：`number`），用于存储或配置内容宽度。
   */
  contentWidth: number;
  /**
   * Property `offsetHeight` (`number`) storing offset height.
   * @zh 属性 `offsetHeight`（类型：`number`），用于存储或配置偏移量高度。
   */
  offsetHeight: number;
  /**
   * Property `offsetWidth` (`number`) storing offset width.
   * @zh 属性 `offsetWidth`（类型：`number`），用于存储或配置偏移量宽度。
   */
  offsetWidth: number;
}

/**
 * Type alias `ScrollTimelineFunc` representing scroll timeline func (`({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void`).
 * @zh 类型别名 `ScrollTimelineFunc`，表示滚动时间轴Func（`({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void`）。
 */
export type ScrollTimelineFunc = ({ source, axis }: { source: HTMLElement, axis: 'x' | 'y' }) => void;
