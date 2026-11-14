/**
 * @fileoverview Module `src/data/datatable/body/progress-bar.component.ts` providing progress bar component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/body/progress-bar.component.ts`，提供进度条条组件相关的定义与实现。
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Angular component `ProgressBarComponent` (selector: 'datatable-progress') providing progress bar component presentation and interaction in `src/data/datatable/body`.
 * @zh Angular 组件 `ProgressBarComponent`（selector: 'datatable-progress'），提供进度条条组件的视图渲染与交互逻辑（位于 `src/data/datatable/body`）。
 */
@Component({
  selector: 'datatable-progress',
  template: `
    <div class="progress-linear" role="progressbar">
      <div class="container">
        <div class="bar"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ProgressBarComponent {}
