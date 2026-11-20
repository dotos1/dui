/**
 * @fileoverview Module `src/container/dock-layout/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */


export * from './dock-layout.module';
export * from './dock-layout-component.service';
export * from './dock-layout-host.component';
// 面板组件可以注入 DockLayoutContainerInjectionToken 拿到自己的容器（initialState、标题、尺寸等）
export * from './injection-tokens';
export * from './dock-layout-manager.service';

export * from './dock-layout';
export * from './layout-manager';
export * from './virtual-layout';

export * from './config/config';
export * from './config/resolved-config';
export * from './container/component-container';
export * from './controls';
export * from './errors';
export * from './items';
export * from './utils';
