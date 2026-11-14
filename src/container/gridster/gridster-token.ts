/**
 * @fileoverview Module `src/container/gridster/gridster-token.ts` providing injection token to decouple `GridsterComponent` and `GridsterPreviewComponent`.
 * @zh 模块文件 `src/container/gridster/gridster-token.ts`，提供注入令牌以解除 `GridsterComponent` 与 `GridsterPreviewComponent` 之间的循环依赖。
 */

import { InjectionToken } from '@angular/core';
import type { GridsterComponent } from './gridster.component';

/**
 * Injection token used to provide the parent `GridsterComponent` to child preview/item components.
 * @zh 注入令牌 `DUI_GRIDSTER`，向子预览与网格项组件提供父级 `GridsterComponent` 实例。
 */
export const DUI_GRIDSTER = new InjectionToken<GridsterComponent>('DUI_GRIDSTER');
