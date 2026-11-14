/**
 * @fileoverview Module `src/container/accordion/expansion-panel-tokens.ts` providing injection tokens and animation timing constants to decouple `ExpansionPanel` and `ExpansionPanelHeader`.
 * @zh 模块文件 `src/container/accordion/expansion-panel-tokens.ts`，提供展开面板的注入令牌与动画常量定义，解除 `ExpansionPanel` 与 `ExpansionPanelHeader` 之间的循环依赖。
 */

import { InjectionToken } from '@angular/core';
import type { ExpansionPanel } from './expansion-panel';

/**
 * Time and timing curve for expansion panel animations.
 * @zh 常量/变量 `EXPANSION_PANEL_ANIMATION_TIMING`，定义 `src/container/accordion` 中的展开面板动画时间。
 */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * Injection token used to provide the parent `ExpansionPanel` to `ExpansionPanelHeader`.
 * @zh 注入令牌 `DUI_EXPANSION_PANEL`，向 `ExpansionPanelHeader` 提供父级 `ExpansionPanel` 实例。
 */
export const DUI_EXPANSION_PANEL = new InjectionToken<ExpansionPanel>('DUI_EXPANSION_PANEL');
