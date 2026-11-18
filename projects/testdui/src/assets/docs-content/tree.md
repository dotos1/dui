## 概述

`tree`（`@dotos1/dui/tree`）提供企业级高性能树形视图组件（`TreeModule` / `TreeComponent` / `TreeModel` / `TreeNode`），底层基于 **MobX** 实现细粒度响应式状态管理，原生支持大数据量虚拟滚动、节点拖拽排序、复选框级联勾选、异步懒加载子节点与关键字过滤。

## 核心模块与职责

| 导出项 | 类型 | 职责说明 |
| --- | --- | --- |
| `TreeModule` | NgModule | 导出树形组件、节点模板指令、拖拽指令与 MobX 脏检查桥接 |
| `TreeComponent` | Component (`<dui-tree-root>`) | 树形控件宿主组件，接收 `nodes`、`options` 并暴露 `treeModel` 实例 |
| `TreeModel` | Class | 树整体状态模型，提供 `getNodeById`、`filterNodes`、`expandAll`、`collapseAll` 等方法 |
| `TreeNode` | Class | 单个树节点包装实例，管理展开态（`isExpanded`）、激活态（`isActive`）、父子引用与懒加载 |

## 架构与设计模式

- **MobX 细粒度计算属性 + `OnPush`**：树节点的展开、折叠、选中与过滤通过 MobX `@observable` / `@computed` 驱动，仅触发受影响子树重绘；搭配虚拟滚动（`TreeVirtualScroll`）可流畅支撑上万节点渲染。

## 典型用法与最佳实践

```typescript
import { ITreeOptions } from '@dotos1/dui/tree';

nodes = [
  {
    id: 1,
    name: '研发中心',
    children: [
      { id: 2, name: '平台架构组' },
      { id: 3, name: '前端组件组' },
    ],
  },
];

options: ITreeOptions = {
  allowDrag: true,
  allowDrop: true,
};
```

```html
<dui-tree-root [nodes]="nodes" [options]="options"></dui-tree-root>
```
