## 概述

`container` 提供搭建应用整体或局部布局骨架所需的容器型组件：面板与标签页（Panel/TabPanel）、手风琴（Accordion）、卡片（Card）、可拖拽网格布局（Gridster）、抽屉式信息面板（InfoDrawer），以及两个独立的重量级布局系统——可拖拽分栏布局 `container/layout`、以及 IDE 风格的窗口停靠系统 `container/dock-layout`（基于 golden-layout 移植）。

## 何时使用

- 需要标签页/面板/手风琴等常规布局容器：直接使用根入口 `@dotos/dui/container`。
- 需要可调整大小的分栏布局：使用 `@dotos/dui/container/layout`。
- 需要类似 VS Code 的可拖拽停靠窗口系统：使用 `@dotos/dui/container/dock-layout`（体积较大，按需引入）。
