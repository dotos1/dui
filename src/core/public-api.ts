/**
 * @fileoverview Module `src/core/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/core/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

export * from './media/index';
export * from './models/index';
export * from './overlay/overlay-state';
export * from './rtl/index';
export * from './style/index';
export * from './WindowRef';
export { Dui } from './dui';
export { ComponentBase, DuiPlugin } from './component.base';
export type { DuiConfig, DuiStyle, DuiListeners, DuiListener, DuiExpression, DuiExpressionProperties, DuiCompiledExpression, DuiPluginConfig } from '@dotos1/dui/base';
export { WindowService } from './window.service';
