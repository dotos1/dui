## 概述

`common`（`@dotos1/dui/common/*`）是数量最多的一类二级入口模块（共 36 个子模块），收录了大量高内聚、可独立按需引入的通用 UI 构建块与交互指令：消息通知（`toastr`）、对话框（`dialogs`）、折叠面板（`collapsible`）、面包屑（`breadcrumbs`）、加载遮罩（`loading`）、搜索框（`search-box`）、拖拽（`dnd` / `dragselect`）、颜色选择器（`colorpicker` / `matcolorpicker`）、剪贴板（`clipboard`）、气泡弹层（`popover`）、键盘快捷键（`keyboard`）等。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos1/dui/common/toastr` | `ToastrModule`, `ToastrService` | 全局非阻塞消息通知（成功/警告/错误/信息提示） |
| `@dotos1/dui/common/dialogs` | `DuiDialogModule`, `DialogService` | 确认框、警告框、输入框与可拖拽模态对话框服务 |
| `@dotos1/dui/common/loading` | `LoadingModule`, `LoadingDirective`, `LoadingService` | 圆形/线性加载指示器，支持 Overlay 遮罩、Replace 替换与全屏锁屏 |
| `@dotos1/dui/common/collapsible` | `CollapsibleModule`, `CollapsibleComponent` | 带标题栏与折叠动画的可收起内容面板 |
| `@dotos1/dui/common/breadcrumbs` | `BreadcrumbsModule`, `BreadcrumbsComponent` | 响应式面包屑导航栏，窗口宽度不足时自动折叠隐藏 |
| `@dotos1/dui/common/search-box` | `DuiSearchModule`, `SearchBoxComponent` | 支持展开/收起过渡与防抖输入的搜索框组件 |
| `@dotos1/dui/common/clipboard` | `ClipboardModule`, `ClipboardService`, `CopyButtonComponent` | 一键复制文本或 JSON 对象到系统剪贴板并弹出反馈提示 |
| `@dotos1/dui/common/dnd` | `DndModule`, `SortableComponent` | 拖拽放置与列表拖拽排序指令集 |

## 架构与设计模式

- **独立二级入口（Secondary Entry Points）**：每个子模块均拥有独立的 `ng-package.json`，确保打包器（Webpack / Rollup / esbuild）能够进行细粒度 Tree-shaking。
- **指令 + 服务双模式驱动**：以 `loading`、`clipboard`、`popover` 为代表的模块同时提供声明式模板指令（如 `*duiLoading`、`[dui-clipboard]`）与命令式服务（`LoadingService`、`ClipboardService`）。

## 典型用法与最佳实践

```typescript
import { NgModule } from '@angular/core';
import { LoadingModule } from '@dotos1/dui/common/loading';
import { BreadcrumbsModule } from '@dotos1/dui/common/breadcrumbs';
import { CollapsibleModule } from '@dotos1/dui/common/collapsible';

@NgModule({
  imports: [LoadingModule, BreadcrumbsModule, CollapsibleModule],
})
export class SharedUiModule {}
```

```html
<dui-breadcrumbs separatorIcon="chevron_right">
  <a dui-breadcrumb>首页</a>
  <a dui-breadcrumb>系统设置</a>
</dui-breadcrumbs>

<div *duiLoading="'cardLoad'; until: !isLoading; strategy: LoadingStrategy.Overlay">
  <dui-collapsible title="高级选项">
    <p>面板内容区域</p>
  </dui-collapsible>
</div>
```
