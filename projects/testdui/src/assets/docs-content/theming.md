## 概述

`theming` 同样不是可导入的 TypeScript 模块，而是一组 Sass 样式片段（重置样式、调色板、排版、elevation 等），通过库的根 `package.json` 以 `exports` 字段的形式暴露给消费方按需 `@use`/`@import`，供需要静态样式（而非运行时 JSS 动态主题）的场景使用。

## 说明

如果你的应用主要依赖 `theme` 模块的 `ThemeService` 做运行时动态换肤，通常不需要直接接触这里的 Sass 片段；只有在需要编译期静态样式（例如自定义构建流程、SSR 场景）时才会用到。
