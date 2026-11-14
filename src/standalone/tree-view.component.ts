/**
 * @fileoverview Module `src/standalone/tree-view.component.ts` providing MobX-free Zoneless Signal WAI-ARIA `DuiTreeViewComponent`.
 * @zh 模块文件 `src/standalone/tree-view.component.ts`，提供零 MobX、纯 Signal 状态驱动、完整支持 WAI-ARIA `tree`/`treeitem` 键盘无障碍导航的 `DuiTreeViewComponent` 树组件。
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  ModelSignal,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

/**
 * Interface `DuiTreeNodeItem` describing a hierarchical node in `DuiTreeViewComponent`.
 * @zh 接口 `DuiTreeNodeItem`，定义独立 Zoneless 树组件的层级节点数据结构。
 */
export interface DuiTreeNodeItem {
  /**
   * Property `id` (`string`) storing unique node identifier.
   * @zh 属性 `id`（类型：`string`），存储树节点唯一标识符。
   */
  readonly id: string;
  /**
   * Property `label` (`string`) storing visible node label.
   * @zh 属性 `label`（类型：`string`），存储树节点显示名称。
   */
  readonly label: string;
  /**
   * Optional property `icon` (`string`) storing Material icon ligature.
   * @zh 可选属性 `icon`（类型：`string`），存储节点前置图标名称。
   */
  readonly icon?: string;
  /**
   * Optional property `disabled` (`boolean`) indicating whether node interaction is disabled.
   * @zh 可选属性 `disabled`（类型：`boolean`），标识节点是否禁用。
   */
  readonly disabled?: boolean;
  /**
   * Optional property `children` (`readonly DuiTreeNodeItem[]`) storing child nodes.
   * @zh 可选属性 `children`（类型：`readonly DuiTreeNodeItem[]`），存储子节点列表。
   */
  readonly children?: readonly DuiTreeNodeItem[];
  /**
   * Optional property `data` (`Readonly<Record<string, unknown>>`) storing strongly-typed business payload without `any`.
   * @zh 可选属性 `data`（类型：`Readonly<Record<string, unknown>>`），存储业务附加元数据（零 `any`）。
   */
  readonly data?: Readonly<Record<string, unknown>>;
}

/**
 * Interface `DuiFlatTreeNode` representing a flattened visible row for WAI-ARIA tree rendering and keyboard navigation.
 * @zh 接口 `DuiFlatTreeNode`，表示经过展开状态计算后的可见扁平树节点行信息。
 */
export interface DuiFlatTreeNode {
  readonly item: DuiTreeNodeItem;
  readonly level: number;
  readonly hasChildren: boolean;
  readonly isExpanded: boolean;
  readonly parentId: string | null;
  readonly posInSet: number;
  readonly setSize: number;
}

/**
 * Standalone Zoneless WAI-ARIA tree component `<dui-standalone-tree>` driven purely by Angular Signals without MobX.
 * @zh 独立 Zoneless 树组件 `<dui-standalone-tree>`，基于纯 Angular Signal 状态与 WAI-ARIA `tree`/`treeitem` 键盘导航（上下左右、Home/End、Enter/Space）实现。
 */
@Component({
  selector: 'dui-standalone-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="dui-s-tree"
      role="tree"
      [attr.aria-label]="ariaLabel()"
      (keydown)="handleKeydown($event)">
      @for (row of visibleNodes(); track row.item.id) {
        <div
          class="dui-s-tree__item"
          role="treeitem"
          [attr.data-node-id]="row.item.id"
          [attr.aria-level]="row.level"
          [attr.aria-setsize]="row.setSize"
          [attr.aria-posinset]="row.posInSet"
          [attr.aria-expanded]="row.hasChildren ? row.isExpanded : null"
          [attr.aria-selected]="selectedId() === row.item.id"
          [attr.aria-disabled]="row.item.disabled ? 'true' : null"
          [attr.tabindex]="resolvedFocusedId() === row.item.id ? 0 : -1"
          [style.padding-left.px]="(row.level - 1) * 18 + 8"
          [class.dui-s-tree__item--selected]="selectedId() === row.item.id"
          [class.dui-s-tree__item--disabled]="row.item.disabled === true"
          (focus)="setFocusedNode(row.item.id)"
          (click)="handleItemClick(row, $event)">
          @if (row.hasChildren) {
            <span
              class="dui-s-tree__expander"
              aria-hidden="true"
              (click)="handleExpanderClick(row.item.id, row.item.disabled === true, $event)">
              {{ row.isExpanded ? '▾' : '▸' }}
            </span>
          } @else {
            <span class="dui-s-tree__spacer" aria-hidden="true"></span>
          }
          @if (row.item.icon) {
            <span class="dui-s-tree__icon material-icons" aria-hidden="true">{{ row.item.icon }}</span>
          }
          <span class="dui-s-tree__label">{{ row.item.label }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .dui-s-tree {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 4px;
        user-select: none;
        color: var(--dui-on-surface, var(--mat-sys-on-surface, #191c1c));
      }
      .dui-s-tree__item {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 30px;
        padding-right: 8px;
        border-radius: 6px;
        font-size: 13px;
        line-height: 1.3;
        cursor: pointer;
        transition: background-color 120ms ease, color 120ms ease;
      }
      .dui-s-tree__item:hover:not(.dui-s-tree__item--disabled) {
        background-color: var(--dui-hover, rgba(0, 0, 0, 0.05));
      }
      .dui-s-tree__item:focus-visible {
        outline: 2px solid var(--dui-primary, var(--mat-sys-primary, #006a6a));
        outline-offset: -2px;
      }
      .dui-s-tree__item--selected {
        background-color: var(--dui-selected, var(--mat-sys-primary-container, #9cf1f0));
        color: var(--mat-sys-on-primary-container, var(--dui-on-surface, #002020));
        font-weight: 500;
      }
      .dui-s-tree__item--disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .dui-s-tree__expander,
      .dui-s-tree__spacer {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        font-size: 12px;
      }
      .dui-s-tree__icon {
        font-size: 16px;
        flex-shrink: 0;
      }
      .dui-s-tree__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class DuiTreeViewComponent {
  private readonly _hostRef: ElementRef<HTMLElement> = inject(ElementRef);

  /**
   * Required Signal input `nodes` (`InputSignal<readonly DuiTreeNodeItem[]>`).
   * @zh 必填 Signal 输入 `nodes`，传入层级树节点数组。
   */
  readonly nodes: InputSignal<readonly DuiTreeNodeItem[]> = input.required<readonly DuiTreeNodeItem[]>();

  /**
   * Optional Signal input `ariaLabel` (`InputSignal<string>`) providing accessible tree label.
   * @zh 可选 Signal 输入 `ariaLabel`（默认值 `'Navigation tree'`），为 `role="tree"` 提供无障碍名称。
   */
  readonly ariaLabel: InputSignal<string> = input<string>('Navigation tree');

  /**
   * Two-way Signal model `expandedIds` (`ModelSignal<readonly string[]>`) tracking expanded branch node IDs.
   * @zh 双向绑定 Signal 模型 `expandedIds`（默认空数组），维护当前展开的节点 ID 列表。
   */
  readonly expandedIds: ModelSignal<readonly string[]> = model<readonly string[]>([]);

  /**
   * Two-way Signal model `selectedId` (`ModelSignal<string>`) tracking currently selected node ID.
   * @zh 双向绑定 Signal 模型 `selectedId`（默认 `null`），维护当前选中的节点 ID。
   */
  readonly selectedId: ModelSignal<string | null> = model<string | null>(null);

  /**
   * Signal output `nodeActivated` (`OutputEmitterRef<DuiTreeNodeItem>`) firing when a node is activated via click or Enter/Space.
   * @zh Signal 输出 `nodeActivated`，当节点被点击或通过键盘 Enter/Space 激活时触发。
   */
  readonly nodeActivated: OutputEmitterRef<DuiTreeNodeItem> = output<DuiTreeNodeItem>();

  private readonly _focusedId: WritableSignal<string | null> = signal<string | null>(null);

  /**
   * Computed signal `visibleNodes` flattening currently expanded branches into WAI-ARIA tree rows.
   * @zh 计算属性 `visibleNodes`，根据 `nodes()` 与 `expandedIds()` 实时展开生成可见扁平节点数组。
   */
  readonly visibleNodes: Signal<readonly DuiFlatTreeNode[]> = computed<readonly DuiFlatTreeNode[]>(() => {
    const expandedSet = new Set<string>(this.expandedIds());
    const result: DuiFlatTreeNode[] = [];
    const walk = (
      items: readonly DuiTreeNodeItem[],
      level: number,
      parentId: string | null,
    ): void => {
      const total = items.length;
      for (let i = 0; i < total; i++) {
        const node = items[i];
        if (!node) {
          continue;
        }
        const children = node.children ?? [];
        const hasChildren = children.length > 0;
        const isExpanded = hasChildren && expandedSet.has(node.id);
        result.push({
          item: node,
          level,
          hasChildren,
          isExpanded,
          parentId,
          posInSet: i + 1,
          setSize: total,
        });
        if (isExpanded) {
          walk(children, level + 1, node.id);
        }
      }
    };
    walk(this.nodes(), 1, null);
    return result;
  });

  /**
   * Computed signal `resolvedFocusedId` resolving roving tabindex target ID.
   * @zh 计算属性 `resolvedFocusedId`，确定当前承载 `tabindex="0"` 的漫游焦点节点 ID。
   */
  readonly resolvedFocusedId: Signal<string | null> = computed<string | null>(() => {
    const rows = this.visibleNodes();
    const focused = this._focusedId();
    if (focused && rows.some((r) => r.item.id === focused)) {
      return focused;
    }
    const selected = this.selectedId();
    if (selected && rows.some((r) => r.item.id === selected)) {
      return selected;
    }
    const firstEnabled = rows.find((r) => !r.item.disabled);
    return firstEnabled ? firstEnabled.item.id : null;
  });

  /**
   * Updates roving focus target ID.
   * @zh 更新漫游焦点指向的节点 ID。
   * @param id - Node ID (`string`) / 节点 ID（`string`）
   */
  setFocusedNode(id: string): void {
    this._focusedId.set(id);
  }

  /**
   * Toggles expansion state of a branch node by `id`.
   * @zh 切换指定分支节点的展开/折叠状态。
   * @param id - Branch node ID (`string`) / 分支节点 ID（`string`）
   */
  toggleExpand(id: string): void {
    const current = this.expandedIds();
    if (current.includes(id)) {
      this.expandedIds.set(current.filter((item) => item !== id));
    } else {
      this.expandedIds.set([...current, id]);
    }
  }

  /**
   * Expands a branch node if not already expanded.
   * @zh 展开指定分支节点（幂等）。
   * @param id - Branch node ID (`string`) / 分支节点 ID（`string`）
   */
  expandNode(id: string): void {
    const current = this.expandedIds();
    if (!current.includes(id)) {
      this.expandedIds.set([...current, id]);
    }
  }

  /**
   * Collapses a branch node if currently expanded.
   * @zh 折叠指定分支节点（幂等）。
   * @param id - Branch node ID (`string`) / 分支节点 ID（`string`）
   */
  collapseNode(id: string): void {
    const current = this.expandedIds();
    if (current.includes(id)) {
      this.expandedIds.set(current.filter((item) => item !== id));
    }
  }

  /**
   * Selects and activates a non-disabled node.
   * @zh 选中并激活指定未禁用节点，同时发出 `nodeActivated` 事件。
   * @param node - Tree node item (`DuiTreeNodeItem`) / 树节点数据项（`DuiTreeNodeItem`）
   */
  activateNode(node: DuiTreeNodeItem): void {
    if (node.disabled) {
      return;
    }
    this._focusedId.set(node.id);
    this.selectedId.set(node.id);
    this.nodeActivated.emit(node);
  }

  /**
   * Handles expander chevron click without triggering row activation twice.
   * @zh 处理展开箭头点击事件。
   * @param id - Node ID (`string`) / 节点 ID（`string`）
   * @param isDisabled - Whether node is disabled (`boolean`) / 是否禁用（`boolean`）
   * @param event - Mouse event (`MouseEvent`) / 鼠标事件（`MouseEvent`）
   */
  handleExpanderClick(id: string, isDisabled: boolean, event: MouseEvent): void {
    event.stopPropagation();
    if (isDisabled) {
      return;
    }
    this.toggleExpand(id);
  }

  /**
   * Handles row click: activates node and toggles branch expansion if applicable.
   * @zh 处理树节点行点击：选中并激活节点，若包含子节点则同步切换展开态。
   * @param row - Flattened tree row (`DuiFlatTreeNode`) / 扁平可见节点行（`DuiFlatTreeNode`）
   * @param event - Mouse event (`MouseEvent`) / 鼠标事件（`MouseEvent`）
   */
  handleItemClick(row: DuiFlatTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    if (row.item.disabled) {
      return;
    }
    if (row.hasChildren) {
      this.toggleExpand(row.item.id);
    }
    this.activateNode(row.item);
  }

  /**
   * Handles full WAI-ARIA Tree keyboard navigation (`ArrowDown`, `ArrowUp`, `ArrowRight`, `ArrowLeft`, `Home`, `End`, `Enter`, ` `).
   * @zh 处理完整 WAI-ARIA 树键盘无障碍导航（上下移动焦点、右展开/进入子节点、左折叠/回到父节点、Home/End 首尾跳转、Enter/Space 激活选中）。
   * @param event - Keyboard event (`KeyboardEvent`) / 键盘事件对象（`KeyboardEvent`）
   */
  handleKeydown(event: KeyboardEvent): void {
    const rows = this.visibleNodes();
    if (rows.length === 0) {
      return;
    }
    const activeId = this.resolvedFocusedId();
    const currentIndex = Math.max(
      0,
      rows.findIndex((r) => r.item.id === activeId),
    );
    const currentRow = rows[currentIndex];
    if (!currentRow) {
      return;
    }

    const focusRowById = (targetId: string): void => {
      this._focusedId.set(targetId);
      const domEl = this._hostRef.nativeElement.querySelector<HTMLElement>(
        `[data-node-id="${targetId}"]`,
      );
      domEl?.focus();
    };

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      for (let i = currentIndex + 1; i < rows.length; i++) {
        const candidate = rows[i];
        if (candidate && !candidate.item.disabled) {
          focusRowById(candidate.item.id);
          break;
        }
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      for (let i = currentIndex - 1; i >= 0; i--) {
        const candidate = rows[i];
        if (candidate && !candidate.item.disabled) {
          focusRowById(candidate.item.id);
          break;
        }
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (currentRow.hasChildren && !currentRow.isExpanded) {
        this.expandNode(currentRow.item.id);
      } else if (currentRow.hasChildren && currentRow.isExpanded) {
        const nextRow = rows[currentIndex + 1];
        if (nextRow && nextRow.parentId === currentRow.item.id && !nextRow.item.disabled) {
          focusRowById(nextRow.item.id);
        }
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (currentRow.hasChildren && currentRow.isExpanded) {
        this.collapseNode(currentRow.item.id);
      } else if (currentRow.parentId) {
        focusRowById(currentRow.parentId);
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      const firstEnabled = rows.find((r) => !r.item.disabled);
      if (firstEnabled) {
        focusRowById(firstEnabled.item.id);
      }
    } else if (event.key === 'End') {
      event.preventDefault();
      for (let i = rows.length - 1; i >= 0; i--) {
        const candidate = rows[i];
        if (candidate && !candidate.item.disabled) {
          focusRowById(candidate.item.id);
          break;
        }
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activateNode(currentRow.item);
    }
  }
}
