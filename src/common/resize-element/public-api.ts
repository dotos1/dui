/**
 * @fileoverview Module `src/common/resize-element/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/common/resize-element/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

/*
 * Public API Surface of angular-resizable-element
 */

export * from './resizable.module';
export { BoundingRectangle } from './interfaces/bounding-rectangle.interface';
export { Edges } from './interfaces/edges.interface';
export { ResizeEvent } from './interfaces/resize-event.interface';
export { ResizableDirective } from './resizable.directive';
export { ResizeHandleDirective } from './resize-handle.directive';
