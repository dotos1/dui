/**
 * @fileoverview Module `src/data/datatable/utils/tree.ts` providing tree definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/tree.ts`，提供树形控件相关的定义与实现。
 */

import { getterForProp } from './column-prop-getters';
import { TableColumnProp } from '../types/table-column.type';


/**
 * Type alias `OptionalValueGetter` representing optional value getter (`(row: any) => any | undefined`).
 * @zh 类型别名 `OptionalValueGetter`，表示可选值Getter（`(row: any) => any | undefined`）。
 */
export type OptionalValueGetter = { (row) };
/**
 * Executes `optionalGetterForProp` to handle optional getter for prop.
 * @zh 执行 `optionalGetterForProp`，用于可选Getter用于属性。
 * @param prop - prop parameter (`TableColumnProp`) / 属性参数（`TableColumnProp`）
 * @returns Result of type `OptionalValueGetter` / 类型为 `OptionalValueGetter` 的返回值
 */
export function optionalGetterForProp(prop: TableColumnProp): OptionalValueGetter {
  return prop && (row => getterForProp(prop)(row, prop));
}

/**
 * This functions rearrange items by their parents
 * Also sets the level value to each of the items
 *
 * Note: Expecting each item has a property called parentId
 * Note: This algorithm will fail if a list has two or more items with same ID
 * NOTE: This algorithm will fail if there is a deadlock of relationship
 *
 * For example,
 *
 * Input
 *
 * id -> parent
 * 1  -> 0
 * 2  -> 0
 * 3  -> 1
 * 4  -> 1
 * 5  -> 2
 * 7  -> 8
 * 6  -> 3
 *
 *
 * Output
 * id -> level
 * 1      -> 0
 * --3    -> 1
 * ----6  -> 2
 * --4    -> 1
 * 2      -> 0
 * --5    -> 1
 * 7     -> 8
 *
 *
 * @param rows
 *

 * @zh 执行 `groupRowsByParents`，用于分组行列表按父级。
 */
export function groupRowsByParents(rows, from?: OptionalValueGetter, to?: OptionalValueGetter) {
  if (from && to) {
    const nodeById = {};
    const l = rows.length;
    let node: TreeNode | null = null;

    nodeById[0] = new TreeNode(); // that's the root node

    // 原写法用数组 + indexOf 去重，每行一次线性查找，是 O(n²)；
    // 下面对 uniqIDs 的成员判断同理，改用 Set 降到 O(n)
    const uniqIDs = rows.reduce((set, item) => {
      set.add(to(item));
      return set;
    }, new Set());

    for (let i = 0; i < l; i++) {
      // make TreeNode objects for each item
      nodeById[to(rows[i])] = new TreeNode(rows[i]);
    }

    for (let i = 0; i < l; i++) {
      // link all TreeNode objects
      node = nodeById[to(rows[i])];
      let parent = 0;
      const fromValue = from(node.row);
      if (!!fromValue && uniqIDs.has(fromValue)) {
        parent = fromValue;
      }
      node.parent = nodeById[parent];
      node.row['level'] = node.parent.row['level'] + 1;
      node.parent.children.push(node);
    }

    let resolvedRows = [];
    nodeById[0].flatten(function() {
      //@ts-ignore
      resolvedRows = [...resolvedRows, this.row];
    }, true);

    return resolvedRows;
  } else {
    return rows;
  }
}

/**
 * Class `TreeNode` encapsulating tree node data structures and logic in `src/data/datatable/utils`.
 * @zh 类 `TreeNode`，封装 `src/data/datatable/utils` 中的树形控件节点数据结构与处理逻辑。
 */
class TreeNode {
  /**
   * Property `row` (`any`) storing row.
   * @zh 属性 `row`（类型：`any`），用于存储或配置行。
   */
  public row;
  /**
   * Property `parent` (`any`) storing parent.
   * @zh 属性 `parent`（类型：`any`），用于存储或配置父级。
   */
  public parent;
  /**
   * Property `children` (`any[]`) storing children.
   * @zh 属性 `children`（类型：`any[]`），用于存储或配置子级列表。
   */
  public children;

  /**
   * Creates an instance of `TreeNode` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNode` 实例，并初始化其依赖项与内部状态。
   * @param row - Injected or initial row (`any | null`) / 注入或传入的行（`any | null`）
   */
  constructor(row = null) {
    if (!row) {
      row = {
        level: -1,
        treeStatus: 'expanded'
      };
    }
    this.row = row;
    this.parent = null;
    this.children = [];
  }

  /**
   * Executes `flatten` to handle flatten.
   * @zh 执行 `flatten`，用于flatten。
   * @param f - f parameter (`any`) / f参数（`any`）
   * @param recursive - recursive parameter (`boolean`) / recursive参数（`boolean`）
   */
  flatten(f, recursive: boolean) {
    if (this.row['treeStatus'] === 'expanded') {
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        f.apply(child, Array.prototype.slice.call(arguments, 2));
        // eslint-disable-next-line prefer-spread
        if (recursive) child.flatten.apply(child, arguments);
      }
    }
  }
}
