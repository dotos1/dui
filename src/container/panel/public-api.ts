/**
 * @fileoverview Module `src/container/panel/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/container/panel/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */


export * from './interface/IArea';
export * from './interface/IPoint';
export * from './layout-toggle';
export { DuiLayoutToggleDirective, DuiLayoutCloseDirective, DuiLayoutOpenDirective } from './layout.directives';
export * from './abstract.panel';
export * from './panel.component';
export { SplitComponent } from './split.component';

export {PanelModule} from './panel.module';
