/**
 * @fileoverview Module `src/standalone/split-dock.component.ts` providing Zoneless CSS Grid enterprise split dock container `DuiSplitDockComponent`.
 * @zh 模块文件 `src/standalone/split-dock.component.ts`，提供基于原生 CSS Grid/Flexbox 的高密度企业停靠分栏容器组件 `DuiSplitDockComponent`。
 */

import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  ModelSignal,
  Signal,
  computed,
  input,
  model,
} from '@angular/core';

/**
 * Type alias `DuiDockDirection` specifying horizontal or vertical split orientation.
 * @zh 类型别名 `DuiDockDirection`，定义停靠分栏容器的主轴方向。
 */
export type DuiDockDirection = 'horizontal' | 'vertical';

/**
 * Standalone Zoneless enterprise split-dock container `<dui-standalone-split-dock>` using native CSS Grid without `fxLayout`.
 * @zh 独立 Zoneless 企业级高密度停靠分栏容器 `<dui-standalone-split-dock>`，纯原生 CSS Grid/Flexbox 实现，支持 `direction`、`sidebarSize` 与 `collapsed = model<boolean>(false)`。
 */
@Component({
  selector: 'dui-standalone-split-dock',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="dui-s-dock"
      [class.dui-s-dock--vertical]="direction() === 'vertical'"
      [class.dui-s-dock--collapsed]="collapsed()"
      [style.grid-template-columns]="gridColumns()"
      [style.grid-template-rows]="gridRows()">
      <aside
        class="dui-s-dock__sidebar"
        [attr.aria-label]="sidebarTitle() || 'Sidebar panel'"
        [attr.aria-expanded]="!collapsed()">
        <div class="dui-s-dock__sidebar-bar">
          @if (!collapsed() && sidebarTitle()) {
            <span class="dui-s-dock__sidebar-title">{{ sidebarTitle() }}</span>
          }
          <button
            type="button"
            class="dui-s-dock__toggle"
            [attr.aria-expanded]="!collapsed()"
            [attr.aria-label]="collapsed() ? 'Expand dock sidebar' : 'Collapse dock sidebar'"
            (click)="toggleCollapsed()">
            {{ collapsed() ? '▸' : '◂' }}
          </button>
        </div>
        @if (!collapsed()) {
          <div class="dui-s-dock__sidebar-content">
            <ng-content select="[duiDockSidebar]"></ng-content>
          </div>
        }
      </aside>
      <main class="dui-s-dock__main">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .dui-s-dock {
        display: grid;
        width: 100%;
        min-height: 240px;
        height: 100%;
        border: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
        border-radius: 8px;
        background-color: var(--dui-surface, var(--mat-sys-surface, #fafdfd));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
        overflow: hidden;
      }
      .dui-s-dock__sidebar {
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        background-color: var(--dui-surface-container, var(--mat-sys-surface-container, #eef2f2));
        border-right: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
      .dui-s-dock--vertical .dui-s-dock__sidebar {
        border-right: none;
        border-bottom: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
      .dui-s-dock__sidebar-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        height: 34px;
        padding: 0 8px;
        border-bottom: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
      }
      .dui-s-dock__sidebar-title {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.02em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dui-s-dock__toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 4px;
        background: transparent;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
        cursor: pointer;
      }
      .dui-s-dock__toggle:hover {
        background-color: var(--dui-hover, rgba(0, 0, 0, 0.06));
      }
      .dui-s-dock__toggle:focus-visible {
        outline: 2px solid var(--dui-primary, var(--mat-sys-primary, #006a6a));
      }
      .dui-s-dock__sidebar-content {
        flex: 1 1 auto;
        overflow: auto;
        padding: 8px;
      }
      .dui-s-dock__main {
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        overflow: auto;
        padding: 12px;
      }
    `,
  ],
})
export class DuiSplitDockComponent {
  /**
   * Signal input `direction` (`InputSignal<DuiDockDirection>`) configuring split axis (`'horizontal'` or `'vertical'`).
   * @zh Signal 输入 `direction`（默认值 `'horizontal'`），配置分栏主轴方向。
   */
  readonly direction: InputSignal<DuiDockDirection> = input<DuiDockDirection>('horizontal');

  /**
   * Signal input `sidebarSize` (`InputSignal<string>`) configuring CSS track size of dock sidebar when expanded.
   * @zh Signal 输入 `sidebarSize`（默认值 `'260px'`），配置展开态停靠侧栏轨道尺寸。
   */
  readonly sidebarSize: InputSignal<string> = input<string>('260px');

  /**
   * Signal input `sidebarTitle` (`InputSignal<string>`) configuring optional dock sidebar header label.
   * @zh Signal 输入 `sidebarTitle`（默认值 `''`），配置侧栏顶部标题。
   */
  readonly sidebarTitle: InputSignal<string> = input<string>('');

  /**
   * Two-way Signal model `collapsed` (`ModelSignal<boolean>`) controlling sidebar collapsed state.
   * @zh 双向 Signal 模型 `collapsed`（默认值 `false`），控制停靠侧栏折叠/展开状态。
   */
  readonly collapsed: ModelSignal<boolean> = model<boolean>(false);

  /**
   * Computed CSS `grid-template-columns` value derived from `direction()`, `collapsed()`, and `sidebarSize()`.
   * @zh 计算属性 `gridColumns`，根据方向与折叠态生成原生 CSS Grid 列轨道定义。
   */
  readonly gridColumns: Signal<string> = computed<string>(() => {
    if (this.direction() === 'vertical') {
      return 'minmax(0, 1fr)';
    }
    return this.collapsed() ? '40px minmax(0, 1fr)' : `${this.sidebarSize()} minmax(0, 1fr)`;
  });

  /**
   * Computed CSS `grid-template-rows` value derived from `direction()`, `collapsed()`, and `sidebarSize()`.
   * @zh 计算属性 `gridRows`，根据方向与折叠态生成原生 CSS Grid 行轨道定义。
   */
  readonly gridRows: Signal<string> = computed<string>(() => {
    if (this.direction() === 'horizontal') {
      return 'minmax(0, 1fr)';
    }
    return this.collapsed() ? '36px minmax(0, 1fr)' : `${this.sidebarSize()} minmax(0, 1fr)`;
  });

  /**
   * Toggles the `collapsed` model Signal between `true` and `false`.
   * @zh 切换停靠侧栏的折叠与展开状态。
   */
  toggleCollapsed(): void {
    this.collapsed.update((prev) => !prev);
  }
}
