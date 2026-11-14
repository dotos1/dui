/**
 * @fileoverview Module `src/standalone/tabs.component.ts` providing Zoneless Signal WAI-ARIA `DuiTabsComponent`.
 * @zh 模块文件 `src/standalone/tabs.component.ts`，提供遵循 WAI-ARIA `tablist`/`tab`/`tabpanel` 规范与键盘方向键导航的纯 Signal 标签页组件 `DuiTabsComponent`。
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  ModelSignal,
  Signal,
  computed,
  inject,
  input,
  model,
} from '@angular/core';

/**
 * Interface `DuiTabItem` describing a single tab header item.
 * @zh 接口 `DuiTabItem`，定义单个标签页头部配置项。
 */
export interface DuiTabItem {
  /**
   * Property `id` (`string`) storing unique tab identifier.
   * @zh 属性 `id`（类型：`string`），存储标签页唯一标识符。
   */
  readonly id: string;
  /**
   * Property `label` (`string`) storing visible tab label.
   * @zh 属性 `label`（类型：`string`），存储标签页标题文本。
   */
  readonly label: string;
  /**
   * Optional property `icon` (`string`) storing Material icon ligature.
   * @zh 可选属性 `icon`（类型：`string`），存储标签前置图标名。
   */
  readonly icon?: string;
  /**
   * Optional property `disabled` (`boolean`) indicating whether tab cannot be selected.
   * @zh 可选属性 `disabled`（类型：`boolean`），标识标签是否禁用。
   */
  readonly disabled?: boolean;
  /**
   * Optional property `badge` (`string | number`) storing compact badge count or status.
   * @zh 可选属性 `badge`（类型：`string | number`），存储标签右侧徽标值。
   */
  readonly badge?: string | number;
}

/**
 * Standalone Zoneless WAI-ARIA tabs component `<dui-standalone-tabs>` with two-way `activeId = model<string>()` and roving keyboard navigation.
 * @zh 独立 Zoneless 标签页组件 `<dui-standalone-tabs>`，支持 `tabs = input.required<readonly DuiTabItem[]>()`、`activeId = model<string>()` 双向 Signal 绑定以及左右方向键/Home/End 无障碍切换。
 */
@Component({
  selector: 'dui-standalone-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dui-s-tabs">
      <div
        class="dui-s-tabs__list"
        role="tablist"
        aria-orientation="horizontal"
        (keydown)="handleKeydown($event)">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            class="dui-s-tabs__tab"
            role="tab"
            [attr.id]="'dui-tab-' + tab.id"
            [attr.data-tab-id]="tab.id"
            [attr.aria-selected]="resolvedActiveId() === tab.id"
            [attr.aria-controls]="'dui-tabpanel-' + tab.id"
            [attr.aria-disabled]="tab.disabled ? 'true' : null"
            [attr.tabindex]="resolvedActiveId() === tab.id ? 0 : -1"
            [disabled]="tab.disabled === true"
            [class.dui-s-tabs__tab--active]="resolvedActiveId() === tab.id"
            (click)="selectTab(tab.id)">
            @if (tab.icon) {
              <span class="dui-s-tabs__icon material-icons" aria-hidden="true">{{ tab.icon }}</span>
            }
            <span>{{ tab.label }}</span>
            @if (tab.badge !== undefined) {
              <span class="dui-s-tabs__badge">{{ tab.badge }}</span>
            }
          </button>
        }
      </div>
      <div
        class="dui-s-tabs__panel"
        role="tabpanel"
        [attr.id]="'dui-tabpanel-' + resolvedActiveId()"
        [attr.aria-labelledby]="'dui-tab-' + resolvedActiveId()"
        tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dui-s-tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .dui-s-tabs__list {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        border-bottom: 1px solid var(--dui-outline-variant, var(--mat-sys-outline-variant, #bec9c8));
        background-color: var(--dui-surface, var(--mat-sys-surface, #fafdfd));
        padding: 0 8px;
        overflow-x: auto;
      }
      .dui-s-tabs__tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 38px;
        padding: 0 14px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--mat-sys-on-surface-variant, #3f4948);
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: color 140ms ease, border-color 140ms ease, background-color 140ms ease;
      }
      .dui-s-tabs__tab:hover:not(:disabled) {
        background-color: var(--dui-hover, rgba(0, 0, 0, 0.04));
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-tabs__tab:focus-visible {
        outline: 2px solid var(--dui-primary, var(--mat-sys-primary, #006a6a));
        outline-offset: -2px;
      }
      .dui-s-tabs__tab--active {
        color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
        border-bottom-color: var(--dui-primary, var(--mat-sys-primary, #006a6a));
        font-weight: 600;
      }
      .dui-s-tabs__tab:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .dui-s-tabs__icon {
        font-size: 16px;
      }
      .dui-s-tabs__badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 9px;
        font-size: 11px;
        background-color: var(--dui-primary-container, var(--mat-sys-primary-container, #9cf1f0));
        color: var(--mat-sys-on-primary-container, #002020);
      }
      .dui-s-tabs__panel {
        padding: 12px 0;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
    `,
  ],
})
export class DuiTabsComponent {
  private readonly _hostRef: ElementRef<HTMLElement> = inject(ElementRef);

  /**
   * Required Signal input `tabs` (`InputSignal<readonly DuiTabItem[]>`).
   * @zh 必填 Signal 输入 `tabs`，传入标签项配置数组。
   */
  readonly tabs: InputSignal<readonly DuiTabItem[]> = input.required<readonly DuiTabItem[]>();

  /**
   * Two-way Signal model `activeId` (`ModelSignal<string>`) storing active tab identifier.
   * @zh 双向绑定 Signal 模型 `activeId`，读取或更新当前激活标签页 ID。
   */
  readonly activeId: ModelSignal<string | undefined> = model<string | undefined>(undefined);

  /**
   * Computed signal `resolvedActiveId` returning explicit `activeId()` or the first enabled tab ID.
   * @zh 计算属性 `resolvedActiveId`，解析当前有效激活标签页 ID（未指定时回退至首个可用标签页）。
   */
  readonly resolvedActiveId: Signal<string> = computed<string>(() => {
    const current = this.activeId();
    const list = this.tabs();
    if (current && list.some((item) => item.id === current && !item.disabled)) {
      return current;
    }
    const fallback = list.find((item) => !item.disabled);
    return fallback ? fallback.id : '';
  });

  /**
   * Activates a non-disabled tab by `id` and updates `activeId` Signal model.
   * @zh 按 `id` 激活未禁用的标签页并同步更新 `activeId` 模型。
   * @param id - Target tab ID (`string`) / 目标标签页 ID（`string`）
   */
  selectTab(id: string): void {
    const target = this.tabs().find((item) => item.id === id);
    if (!target || target.disabled) {
      return;
    }
    this.activeId.set(id);
  }

  /**
   * Handles WAI-ARIA `tablist` keyboard navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
   * @zh 处理 WAI-ARIA 标签栏键盘导航（左右方向键及 `Home` / `End` 键循环切换可用标签）。
   * @param event - Keyboard event (`KeyboardEvent`) / 键盘事件对象（`KeyboardEvent`）
   */
  handleKeydown(event: KeyboardEvent): void {
    const enabledTabs = this.tabs().filter((item) => !item.disabled);
    if (enabledTabs.length === 0) {
      return;
    }
    const currentId = this.resolvedActiveId();
    const currentIndex = Math.max(
      0,
      enabledTabs.findIndex((item) => item.id === currentId),
    );

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex === null) {
      return;
    }
    event.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    if (!nextTab) {
      return;
    }
    this.activeId.set(nextTab.id);
    const btn = this._hostRef.nativeElement.querySelector<HTMLButtonElement>(
      `button[data-tab-id="${nextTab.id}"]`,
    );
    btn?.focus();
  }
}
