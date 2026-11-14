/**
 * @fileoverview Golden single-file example `docs-ai/examples/zoneless-tree-dock.example.ts` demonstrating Split-Dock + WAI-ARIA Signal Tree.
 * @zh 黄金单文件示例 `docs-ai/examples/zoneless-tree-dock.example.ts`，演示高密度停靠分栏容器与零 MobX Signal 树的联动。
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
  DuiSplitDockComponent,
  DuiTreeNodeItem,
  DuiTreeViewComponent,
  provideDuiZoneless,
} from '@dotos/dui/standalone';

const PLANT_ASSET_TREE: readonly DuiTreeNodeItem[] = [
  {
    id: 'plant-east',
    label: '华东数字工厂',
    icon: 'factory',
    children: [
      { id: 'line-a1', label: 'A1 精密装配线', icon: 'precision_manufacturing' },
      { id: 'line-a2', label: 'A2 视觉检测工位', icon: 'visibility' },
    ],
  },
  {
    id: 'plant-north',
    label: '华北储能中心',
    icon: 'bolt',
    children: [
      { id: 'bms-01', label: 'BMS 主控簇 #01', icon: 'battery_charging_full' },
    ],
  },
];

/**
 * Golden example component `ZonelessTreeDockExampleComponent` combining `<dui-standalone-split-dock>` and `<dui-standalone-tree>`.
 * @zh 黄金示例组件 `ZonelessTreeDockExampleComponent`，组合停靠分栏工作台与 WAI-ARIA 无障碍树导航。
 */
@Component({
  selector: 'dui-example-zoneless-tree-dock',
  standalone: true,
  imports: [
    DuiSplitDockComponent,
    DuiTreeViewComponent,
    DuiCardComponent,
    DuiButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dui-standalone-split-dock
      [sidebarTitle]="'产线资产树'"
      [sidebarSize]="'260px'"
      [(collapsed)]="dockCollapsed">
      <div duiDockSidebar>
        <dui-standalone-tree
          [nodes]="treeNodes()"
          [(expandedIds)]="expandedIds"
          [(selectedId)]="selectedId"
          (nodeActivated)="handleNodeActivated($event)">
        </dui-standalone-tree>
      </div>

      <dui-standalone-card
        [title]="activeTitle()"
        [subtitle]="'当前选中节点 ID: ' + (selectedId() ?? '未选择')"
        [padding]="'normal'">
        <div duiCardHeaderExtra>
          <dui-standalone-button
            [variant]="'tonal'"
            [size]="'compact'"
            (clicked)="expandAllRoots()">
            展开全部产线
          </dui-standalone-button>
        </div>
        <p class="workspace-note">支持方向键（上下左右、Home/End）与 Enter/Space 纯键盘无障碍浏览。</p>
      </dui-standalone-card>
    </dui-standalone-split-dock>
  `,
  styles: [
    `
      .workspace-note {
        margin: 0;
        font-size: 13px;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
    `,
  ],
})
export class ZonelessTreeDockExampleComponent {
  readonly dockCollapsed: WritableSignal<boolean> = signal<boolean>(false);
  readonly treeNodes: WritableSignal<readonly DuiTreeNodeItem[]> = signal<readonly DuiTreeNodeItem[]>(PLANT_ASSET_TREE);
  readonly expandedIds: WritableSignal<readonly string[]> = signal<readonly string[]>(['plant-east']);
  readonly selectedId: WritableSignal<string | null> = signal<string | null>('line-a1');
  readonly activeTitle: WritableSignal<string> = signal<string>('A1 精密装配线');

  /**
   * Updates detail header when a tree node is activated.
   * @zh 当树节点被激活时同步更新右侧详情面板标题。
   * @param node - Activated tree node (`DuiTreeNodeItem`) / 被激活的树节点
   */
  handleNodeActivated(node: DuiTreeNodeItem): void {
    this.activeTitle.set(node.label);
  }

  /**
   * Expands all top-level branch nodes via Signal model update.
   * @zh 通过 Signal 模型不可变更新一键展开全部顶层产线节点。
   */
  expandAllRoots(): void {
    this.expandedIds.set(this.treeNodes().map((item) => item.id));
  }
}

/**
 * Bootstraps `ZonelessTreeDockExampleComponent` in pure Zoneless mode.
 * @zh 以纯 Zoneless 模式启动 `ZonelessTreeDockExampleComponent`。
 * @returns Bootstrap promise (`Promise<unknown>`) / 启动 Promise
 */
export function bootstrapZonelessTreeDockExample(): Promise<unknown> {
  return bootstrapApplication(ZonelessTreeDockExampleComponent, {
    providers: [provideDuiZoneless()],
  });
}
