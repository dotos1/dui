/**
 * @fileoverview Module `src/tree/constants/events.ts` providing events definitions and implementation.
 * @zh 模块文件 `src/tree/constants/events.ts`，提供事件集合相关的定义与实现。
 */

/**
 * Constant/variable `TREE_EVENTS` defining tree events in `src/tree/constants`.
 * @zh 常量/变量 `TREE_EVENTS`，定义 `src/tree/constants` 中的树形控件事件集合。
 */
export const TREE_EVENTS = {
  toggleExpanded: 'toggleExpanded',
  activate: 'activate',
  deactivate: 'deactivate',
  nodeActivate: 'nodeActivate',
  nodeDeactivate: 'nodeDeactivate',
  select: 'select',
  deselect: 'deselect',
  focus: 'focus',
  blur: 'blur',
  initialized: 'initialized',
  updateData: 'updateData',
  moveNode: 'moveNode',
  removeNode: 'removeNode',
  copyNode: 'copyNode',
  event: 'event',
  loadNodeChildren: 'loadNodeChildren',
  changeFilter: 'changeFilter',
  stateChange: 'stateChange'
};
