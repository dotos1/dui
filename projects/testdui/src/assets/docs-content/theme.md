## 概述

`theme` 是 DUI 自研的主题/设计令牌服务，基于 JSS 在运行时动态生成样式规则，而不是依赖静态 SCSS 变量编译。核心是 `ThemeService`（切换主色/强调色/警告色、明暗类型、密度）与 `DotosConfigModule`/`DotosConfigService`（应用级主题配置的存取与持久化）。

## 何时使用

本文档站点本身就复用了这套 `ThemeService`——应用启动时在根组件订阅 `DotosConfigService.config` 并调用 `themeService.changeTheme(...)` 即可让全站样式实时响应配置变化。默认主题为 `primary: blue-500`、`accent: orange-500`、`type: light`。
