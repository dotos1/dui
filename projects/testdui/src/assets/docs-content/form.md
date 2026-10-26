## 概述

`form`（`@dotos/dui/form*`）是一套由 JSON 配置驱动的动态表单引擎（底层衔接 `@dotos/dui/core/form`），允许开发者通过声明式 `items` 字段配置快速渲染复杂业务表单，同时提供独立的日期时间选择器（`form/date/*`）、分段选择器（`form/toggle-select`）、滑块范围（`form/range`）与表单卡片容器（`form/card`）。

## 核心模块与职责

| 二级入口 | 核心导出 | 职责说明 |
| --- | --- | --- |
| `@dotos/dui/form` | `FormModule`, `TextField`, `SelectField`, `CheckboxField`, `RadioField`, `ColorField`, `IconField`, `DateField`, `TriggerField` | 动态表单主模块，注册文本、下拉、复选、单选、颜色、图标、日期与弹层触发器等全部内置字段组件 |
| `@dotos/dui/form/date` | `DateModule`, `DateComponent` | 日期表单包装组件 |
| `@dotos/dui/form/date/picker` | `MatDatetimepickerModule`, `MatDatetimepicker` | 支持日期 + 时间（时/分）联动选择的 Material 日期时间选择器 |
| `@dotos/dui/form/date/adapter` | `MatNativeDatetimeModule`, `DatetimeAdapter` | 原生 `Date` 日期时间适配器 |
| `@dotos/dui/form/date/moment` | `MatMomentDatetimeModule`, `MomentDatetimeAdapter` | 基于 `Moment.js` 的日期时间适配器 |
| `@dotos/dui/form/toggle-select` | `ToggleSelectModule`, `ToggleSelectComponent` | 按钮组分段单选/多选控件 |
| `@dotos/dui/form/card` | `FormCardModule`, `FormCardComponent` | 表单分组卡片容器 |

## 架构与设计模式

- **Schema 驱动与 Reactive Forms 双向同步**：每个字段组件通过 `xtype`（如 `'textfield'`、`'selectfield'`、`'colorfield'`）在 `FormModule` 中注册，底层自动绑定到 Angular `FormGroup`，兼具声明式配置的简洁与 Reactive Forms 的强校验能力。

## 典型用法与最佳实践

```typescript
import { FormModule } from '@dotos/dui/form';

// 在组件中定义动态表单配置：
formConfig = {
  items: [
    { xtype: 'textfield', name: 'username', label: '用户名', value: 'admin', required: true },
    { xtype: 'colorfield', name: 'themeColor', label: '主题色', value: '#2196f3' },
    { xtype: 'checkboxfield', name: 'enabled', label: '立即启用', value: true },
  ],
};
```

```html
<dui-form [config]="formConfig"></dui-form>
```
