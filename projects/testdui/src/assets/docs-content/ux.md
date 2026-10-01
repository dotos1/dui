## 概述

`ux` 收录体量更大、功能更完整的"重型"组件（16 个子模块）：富文本编辑器 `editor`（基于 ProseMirror）、代码编辑器 `monaco-editor`（基于 Monaco）、终端模拟器 `terminal`（基于 xterm.js）、Markdown 渲染 `markdown` 与代码高亮 `highlight`、头像 `avatar`、命令面板 `command-palette`、查询构建器 `query-builder`、多窗口通信 `multi-window`、可拖拽/可缩放的窗口系统 `windows`、图标选择器 `iconpicker`、JSON 编辑器 `jsonEditor`、链接预览卡片 `link-preview` 等。

## 何时使用

当业务需要一个功能完备的"重型控件"而不是从零搭建时来这里找——例如需要在页面里嵌入代码/富文本编辑体验、需要终端交互界面、需要类似 VS Code 命令面板（Ctrl+K）的快捷操作入口等。这些组件普遍体积较大，建议按需（懒加载）引入。
