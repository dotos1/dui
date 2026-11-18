## 概述

`container`（`@dotos1/dui/container*`）提供搭建企业级中后台与低代码工作台整体或局部布局骨架所需的容器型组件，包含常规面板与标签页容器（`@dotos1/dui/container`）、可拖拽分割面板布局（`@dotos1/dui/container/layout`）以及 IDE 级多窗口停靠布局系统（`@dotos1/dui/container/dock-layout`）。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos1/dui/container` | `PanelModule`, `DuiTabsModule`, `AccordionModule`, `CardModule`, `GridsterModule`, `InfoDrawerModule` | 面板、多标签页（`tabpanel`）、手风琴、卡片、响应式网格拖拽布局与右侧属性抽屉 |
| `@dotos1/dui/container/layout` | `DuiLayoutModule`, `LayoutComponent`, `SplitAreaDirective` | 水平/垂直可拖拽分割布局（`<dui-layout>` + `<dui-split-area>`），支持百分比与像素模式 |
| `@dotos1/dui/container/dock-layout` | `DockLayoutModule`, `DockLayoutComponent`, `GoldenLayout` | 类 VS Code 的多标签拖拽、拆分、浮动与持久化停靠窗口引擎 |

## 架构与设计模式

- **动态组件注册机制**：`container` 与 `container/layout` 在模块初始化时通过 `Dui.registerComponentFactory()` 注册动态面板，使低代码引擎可通过 JSON `xtype: 'panel' | 'tabpanel'` 直接实例化布局树。
- **重量级模块物理隔离**：`dock-layout` 作为独立二级入口存在，避免普通业务页面引入基础面板时连带打包复杂停靠算法。

## 典型用法与最佳实践

```html
<!-- 可拖拽水平分割布局 (@dotos1/dui/container/layout) -->
<dui-layout direction="horizontal" style="height: 360px;">
  <dui-split-area [size]="25" [minSize]="15">
    左侧导航树
  </dui-split-area>
  <dui-split-area [size]="75">
    右侧主工作区
  </dui-split-area>
</dui-layout>
```
