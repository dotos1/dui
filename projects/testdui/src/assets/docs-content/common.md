## 概述

`common` 是数量最多的一类模块（31 个子模块），收录了大量小型、可独立引入的可复用构建块：通知提示（toastr）、对话框（dialogs）、拖拽（dnd/dragselect）、颜色选择器（colorpicker/matcolorpicker）、剪贴板（clipboard）、图标（icon）、弹层（popover）、加载状态（loading）、键盘快捷键（keyboard）、搜索框（search-box）等等。

## 何时使用

当你需要一个**独立、轻量、不依赖复杂表单/布局体系**的 UI 片段或交互行为时，先来这里找找看——大概率已经有现成的实现。每个子模块都是独立的二级入口（例如 `@dotos/dui/common/toastr`），按需引入，不会拖累整体包体积。
