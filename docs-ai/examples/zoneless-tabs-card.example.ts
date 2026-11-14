/**
 * @fileoverview Golden single-file example `docs-ai/examples/zoneless-tabs-card.example.ts` demonstrating WAI-ARIA Signal Tabs + Card + Button.
 * @zh 黄金单文件示例 `docs-ai/examples/zoneless-tabs-card.example.ts`，演示 WAI-ARIA 标签页、M3 表面卡片与高密度操作按钮。
 */

import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DuiButtonComponent,
  DuiCardComponent,
  DuiTabItem,
  DuiTabsComponent,
  provideDuiZoneless,
} from '@dotos/dui/standalone';

const INSPECTOR_TABS: readonly DuiTabItem[] = [
  { id: 'overview', label: '运行概览', icon: 'dashboard' },
  { id: 'telemetry', label: '实时遥测', icon: 'insights', badge: 4 },
  { id: 'audit', label: '审计日志', icon: 'history' },
];

/**
 * Golden example component `ZonelessTabsCardExampleComponent` showcasing Signal Tabs and Card composition.
 * @zh 黄金示例组件 `ZonelessTabsCardExampleComponent`，展示标签页双向模型绑定与卡片插槽组合。
 */
@Component({
  selector: 'dui-example-zoneless-tabs-card',
  standalone: true,
  imports: [DuiCardComponent, DuiTabsComponent, DuiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dui-standalone-card
      [title]="'单元监控中心'"
      [subtitle]="'纯原生 CSS Grid + M3 变量自适应亮/暗/深蓝主题'"
      [elevated]="true"
      [padding]="'compact'">
      <dui-standalone-tabs [tabs]="tabs()" [(activeId)]="activeTabId">
        <div class="kpi-grid">
          <div class="kpi-box">
            <span class="kpi-label">当前视图</span>
            <strong class="kpi-value">{{ activeTabId() }}</strong>
          </div>
          <div class="kpi-box">
            <span class="kpi-label">刷新计数</span>
            <strong class="kpi-value">{{ refreshCount() }}</strong>
          </div>
        </div>
      </dui-standalone-tabs>

      <div duiCardFooter>
        <dui-standalone-button
          [variant]="'primary'"
          [size]="'compact'"
          [icon]="'refresh'"
          (clicked)="triggerRefresh()">
          刷新指标
        </dui-standalone-button>
      </div>
    </dui-standalone-card>
  `,
  styles: [
    `
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .kpi-box {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
        border-radius: 6px;
        background-color: var(--dui-surface, var(--mat-sys-surface, #ffffff));
        border: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
      .kpi-label {
        font-size: 11px;
        color: var(--mat-sys-on-surface-variant, #3f4948);
      }
      .kpi-value {
        font-size: 15px;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
    `,
  ],
})
export class ZonelessTabsCardExampleComponent {
  readonly tabs: WritableSignal<readonly DuiTabItem[]> = signal<readonly DuiTabItem[]>(INSPECTOR_TABS);
  readonly activeTabId: WritableSignal<string | undefined> = signal<string | undefined>('overview');
  readonly refreshCount: WritableSignal<number> = signal<number>(1);

  /**
   * Increments refresh counter via pure Signal update.
   * @zh 通过纯 Signal 递增刷新计数器，零 `Zone.js` 依赖触发局部重绘。
   */
  triggerRefresh(): void {
    this.refreshCount.update((n) => n + 1);
  }
}

/**
 * Bootstraps `ZonelessTabsCardExampleComponent` in pure Zoneless mode.
 * @zh 以纯 Zoneless 模式启动 `ZonelessTabsCardExampleComponent`。
 * @returns Bootstrap promise (`Promise<unknown>`) / 启动 Promise
 */
export function bootstrapZonelessTabsCardExample(): Promise<unknown> {
  return bootstrapApplication(ZonelessTabsCardExampleComponent, {
    providers: [provideDuiZoneless()],
  });
}
