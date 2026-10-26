/**
 * @fileoverview Module `src/ux/multi-window/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

/*
 * Public API Surface of ngx-multi-window
 */

export * from './multi-window.module';

export * from './providers/config.provider';
export * from './providers/multi-window.service';
export * from './providers/storage.service';
export * from './providers/window.provider';

export * from './types/message.type';
export * from './types/multi-window.config';
export * from './types/window-save-strategy.enum';
export * from './types/window.type';
