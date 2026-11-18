## 概述

`ux`（`@dotos1/dui/ux/*`）收录面向开发者工具与复杂工作台交互的 10 个**高阶业务体验（UX）模块**：代码高亮（`highlight`）、命令面板（`command-palette`）、可视化查询构建器（`query-builder`）、多窗口桌面系统（`windows` / `multi-window`）、图标选择器（`iconpicker`）、链接预览（`link-preview`）、线条样式选择器（`line-style`）、轻量代码编辑器（`ux`）与用户头像（`avatar`）。

> 重型编辑器与终端扩展（Monaco 代码编辑器、ProseMirror 富文本编辑器、Web 终端 `xterm`、Markdown 渲染与编辑、JSON 编辑器）已下沉至企业扩展库 `@dotos1/duix`，确保 `@dotos/dui` 核心库保持零重型编辑器膨胀。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos1/dui/ux/highlight` | `HighlightModule`, `HighlightComponent` (`<dui-highlight>`) | 基于可选对等依赖 `highlight.js` 的多语言代码语法高亮与一键复制组件 |
| `@dotos1/dui/ux/command-palette` | `CommandPaletteModule`, `CommandPaletteService` | 仿 VS Code `Ctrl+K` / `Ctrl+P` 模糊搜索快捷命令面板 |
| `@dotos1/dui/ux/query-builder` | `QueryBuilderModule`, `QueryBuilderComponent` | 支持 AND/OR 嵌套逻辑组合的可视化过滤条件构建器 |
| `@dotos1/dui/ux/windows` | `WindowsModule`, `WindowComponent` (`<os-window>`) | 桌面级可拖拽、缩放、置顶浮动窗口管理器 |
| `@dotos1/dui/ux/multi-window` | `MultiWindowModule`, `MultiWindowService` | 跨浏览器分屏窗口协同与消息总线服务 |
| `@dotos1/dui/ux/iconpicker` | `IconPickerModule`, `IconPickerDirective` | 可搜索的图标选择器指令与弹出面板 |
| `@dotos1/dui/ux/link-preview` | `MatLinkPreviewModule` | 超链接富媒体摘要卡片预览与缓存服务 |
| `@dotos1/dui/ux/line-style` | `LineStyleModule` | 工程绘图矢量线型与线宽可视化选择控件 |
| `@dotos1/dui/ux/avatar` | `AvatarModule`, `AvatarComponent` | 支持首字母缩写、图片回退与色彩哈希的用户头像组件 |

## 架构与设计模式

- **独立二级入口按需打包**：每个 UX 组件均封装为独立的二级入口，消费端打包器可进行精确 Tree-shaking，未引入的子模块不会进入应用产物。

## 典型用法与最佳实践

```html
<!-- 代码语法高亮与一键复制 (@dotos1/dui/ux/highlight) -->
<dui-highlight
  [content]="codeSnippet"
  [codeLang]="'typescript'"
  [copyCodeToClipboard]="true">
</dui-highlight>
```
