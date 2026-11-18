## 概述

`theming`（`src/theming`）不是一个可导入的 TypeScript 编译模块，而是随 `@dotos1/dui` 发布的**底层 SCSS 样式与 Mixin 体系**（包含全局样式重置、调色板映射、排版规范、阴影海拔 Elevation 与各组件的 `_*-theme.scss` 宏），通过 `package.json` 的 `exports` 暴露给消费方在构建期按需 `@use` 或 `@import`。

## 核心模块与职责

| SCSS 资源文件 | 职责说明 |
| --- | --- |
| `_all-theme.scss` | 聚合全量 DUI 组件的 SCSS 主题 Mixin，一键注入所有组件基础样式 |
| `_palette.scss` | 预定义扩展色板与对比色映射表 |
| `_reset.scss` | 规范化浏览器默认盒模型、滚动条与字体渲染样式 |

## 架构与设计模式

- **编译期 SCSS 与运行时 JSS 互补**：`theming` 负责提供布局结构、动画关键帧与静态兜底样式，而 `@dotos1/dui/theme` 的 `ThemeService` 负责在运行时通过 JSS 动态覆盖颜色令牌。

## 典型用法与最佳实践

在宿主应用的全局样式入口 `src/styles.scss` 中引入编译期主题宏：

```scss
@use '@angular/material' as mat;
@include mat.core();

// 引入 DUI 静态基础样式或自定义 SCSS 变量
body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
}
```
