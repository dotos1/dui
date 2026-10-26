## 概述

`ux`（`@dotos/dui/ux/*`）收录面向开发者工具、富内容创作与复杂工作台交互的 16 个**重型业务体验（UX）模块**：代码高亮（`highlight`）、Markdown 渲染与编辑器（`markdown` / `markdown-editor`）、Monaco 代码编辑器（`monaco-editor`）、ProseMirror 富文本编辑器（`editor`）、终端模拟器（`terminal`）、命令面板（`command-palette`）、可视化查询构建器（`query-builder`）、多窗口桌面系统（`windows` / `multi-window`）、JSON 编辑器（`jsonEditor`）、图标选择器（`iconpicker`）、链接预览（`link-preview`）、线条样式选择器（`line-style`）与用户头像（`avatar`）。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos/dui/ux/highlight` | `HighlightModule`, `HighlightComponent` (`<dui-highlight>`) | 基于 `highlight.js` 的多语言代码语法高亮与一键复制组件 |
| `@dotos/dui/ux/markdown` | `MarkdownModule`, `MarkdownComponent` (`<dui-markdown>`) | 基于 `showdown` 的 Markdown 实时渲染组件，支持锚点跳转与任务列表 |
| `@dotos/dui/ux/monaco-editor` | `MonacoEditorModule`, `EditorComponent` | VS Code 同款 Monaco 代码编辑器与 Diff 对比编辑器封装 |
| `@dotos/dui/ux/editor` | `EditorModule`, `EditorComponent` | 基于 ProseMirror 的可扩展所见即所得富文本编辑器 |
| `@dotos/dui/ux/terminal` | `TerminalModule`, `TerminalComponent` | 基于 `xterm.js` 的 Web 终端模拟器，支持自适应尺寸与超链接插件 |
| `@dotos/dui/ux/command-palette` | `CommandPaletteModule`, `CommandPaletteService` | 仿 VS Code `Ctrl+K` / `Ctrl+P` 模糊搜索快捷命令面板 |
| `@dotos/dui/ux/query-builder` | `QueryBuilderModule`, `QueryBuilderComponent` | 支持 AND/OR 嵌套逻辑组合的可视化过滤条件构建器 |

## 架构与设计模式

- **重型第三方引擎懒加载隔离**：由于 `monaco-editor`、`xterm`、`prosemirror`、`highlight.js` 体积较大，每个组件均封装为独立的二级入口，推荐在路由懒加载模块（`loadChildren`）中按需引入。

## 典型用法与最佳实践

```html
<!-- 1. 代码语法高亮与一键复制 (@dotos/dui/ux/highlight) -->
<dui-highlight
  [content]="codeSnippet"
  [codeLang]="'typescript'"
  [copyCodeToClipboard]="true">
</dui-highlight>

<!-- 2. Markdown 渲染 (@dotos/dui/ux/markdown) -->
<dui-markdown [content]="markdownDoc"></dui-markdown>
```
