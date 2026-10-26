## 概述

`ui`（`@dotos/dui/ui/*`）收录构建应用顶栏、导航菜单与快捷操作入口的高频原子 UI 控件，共包含 7 个独立二级入口：按钮（`button`）、颜色选择按钮（`color-button`）、右键上下文菜单（`context-menu`）、多级菜单栏（`menu`）、悬浮速度拨号按钮（`speeddial`）、配置式工具栏（`toolbar`）以及顶部应用栏（`topbar`）。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos/dui/ui/button` | `ButtonModule`, `ButtonComponent` | 统一封装文本按钮、图标按钮、开关切换按钮（toggle）与下拉菜单触发按钮 |
| `@dotos/dui/ui/topbar` | `TopbarModule`, `TopbarComponent` | 应用顶部导航栏容器，支持左/中/右插槽投影与响应式折叠 |
| `@dotos/dui/ui/toolbar` | `ToolbarModule`, `ToolbarComponent` | JSON 配置驱动的工具栏，支持按钮组、分隔线与溢出折叠菜单 |
| `@dotos/dui/ui/menu` | `MenuModule`, `MenuComponent` | 支持无限层级嵌套、图标、快捷键提示与分割线的下拉/级联菜单 |
| `@dotos/dui/ui/context-menu` | `ContextMenuModule`, `ContextMenuService` | 鼠标右键上下文菜单指令与动态弹出服务 |
| `@dotos/dui/ui/speeddial` | `SpeedDialModule`, `EcoFabSpeedDialComponent` | Material 悬浮操作按钮（FAB）展开式快捷拨号盘 |
| `@dotos/dui/ui/color-button` | `ColorButtonModule`, `ColorButtonComponent` | 集成颜色选择弹层的紧凑型选色按钮 |

## 架构与设计模式

- **声明式属性与 JSON `config` 双模式**：`ui` 下的组件（如 `dui-button`、`dui-menu`）既支持标准 Angular `@Input()` 属性绑定，也支持直接传入完整的 `[config]` 对象，方便在低代码工具栏中批量渲染。

## 典型用法与最佳实践

```html
<!-- 1. 多形态按钮 (@dotos/dui/ui/button) -->
<dui-button type="mat-raised-button" color="primary" text="保存单据" icon="save" (click)="onSave()">
</dui-button>

<!-- 2. 悬浮快捷拨号 (@dotos/dui/ui/speeddial) -->
<dui-fab-speed-dial direction="up">
  <dui-fab-speed-dial-trigger>
    <button mat-fab color="primary"><mat-icon>add</mat-icon></button>
  </dui-fab-speed-dial-trigger>
  <dui-fab-speed-dial-actions>
    <button mat-mini-fab><mat-icon>edit</mat-icon></button>
    <button mat-mini-fab><mat-icon>share</mat-icon></button>
  </dui-fab-speed-dial-actions>
</dui-fab-speed-dial>
```
