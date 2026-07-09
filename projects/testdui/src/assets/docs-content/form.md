## 概述

`form` 是一套通过 JSON 配置驱动的动态表单引擎（内部依赖 `core/form` 的 `FieldConfig`/`FormBuilder`），根入口 `@dotos/dui/form` 聚合了大量字段类型（文本、单选、复选、滑块、颜色选择器、图标选择器、日期选择器、触发器弹层等），只需声明一份 `items` 配置数组即可渲染出完整表单，无需手写每个字段的模板。子模块里还有 `date`（日期选择字段及 moment/native 适配器）、`card`（表单卡片容器）、`toggle-select`（分段选择器）。

## 何时使用

需要通过配置快速搭建表单、且字段种类繁多/需要动态增删字段时用它；如果只是一两个简单输入框，直接用 Angular Reactive Forms + Material 可能更直接。可参考 testdui 应用自带的 `/color` 演示路由，里面展示了颜色选择器和图标选择器字段的实际配置写法。
