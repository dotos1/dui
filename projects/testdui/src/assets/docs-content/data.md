## 概述

`data`（`@dotos/dui/data/*`）收录结构化数据展示、行内编辑与分页导航组件，包含企业级高性能数据表格 `datatable`、多类型键值对属性卡片视图 `cardview` 以及独立分页工具栏 `paging`。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos/dui/data/datatable` | `DatatableModule`, `DatatableComponent`, `DataTableColumnDirective` | 支持列排序、多选、行展开详情、固定列、客户端/服务端分页与虚拟滚动的数据表格 |
| `@dotos/dui/data/cardview` | `CardViewModule`, `CardViewComponent`, `CardViewTextItemModel`, `CardViewBoolItemModel`, `CardViewDateItemModel` | 面向详情抽屉与元数据面板的多类型键值对卡片视图，支持行内编辑、校验与一键复制 |
| `@dotos/dui/data/paging` | `DuiPagingModule`, `DuiPagingBarComponent`, `IPageChangeEvent` | 独立分页导航栏，支持首页/末页跳转、页码链接数配置与刷新回调 |

## 架构与设计模式

- **视口虚拟化与按需渲染**：`datatable` 针对大数据集支持虚拟滚动与行高缓存，避免一次性创建海量 DOM 节点。
- **类型分发器模式（Dispatcher Pattern）**：`cardview` 通过 `CardViewItemDispatcherComponent` 与 `CardItemTypeService` 根据属性模型 `type`（`'text' | 'bool' | 'date' | 'select' | 'map' | 'array'`）动态派发渲染子组件。

## 典型用法与最佳实践

```html
<!-- 1. 数据表格 (@dotos/dui/data/datatable) -->
<dui-datatable
  class="material"
  [rows]="rows"
  [columns]="columns"
  [columnMode]="'force'"
  [headerHeight]="44"
  [rowHeight]="40"
  [limit]="10">
</dui-datatable>

<!-- 2. 属性卡片 (@dotos/dui/data/cardview) -->
<dui-card-view [properties]="cardProperties" [editable]="true"></dui-card-view>

<!-- 3. 分页条 (@dotos/dui/data/paging) -->
<dui-paging-bar [firstLast]="true" [pageLinkCount]="5" [pageSize]="20" [total]="195" (onChange)="onPage($event)">
</dui-paging-bar>
```
