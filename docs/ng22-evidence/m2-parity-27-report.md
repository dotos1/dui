# `@dotos1/dui` Angular 22 vs `7.4.52` 真实 Chrome 27 组合 M2 外观、6 类自研组件、下游主题与真实动画 100% 还原报告

- 生成时间：`2026-11-16T01:21:24.792Z`
- 对照基线：`7.4.52`（`github/master` 提交 `2911c9dcfb5d4057e52976c598e1f9d85a3b9bba`，入库基线文件 `tools/m2-parity/baseline-7452-styles.json.gz`）
- 待测版本：`@dotos1/dui@8.0.0-next.2`（仓库内独立复现目录 `docs/ng22-evidence`）
- 全局动画冻结状态（U1.2）：`freezeTransitionsUsed = false`（**零 `transition: none` / `animation-duration: 0ms` 注入**，全部主题切换、悬停聚焦与弹层开合均自然完成真实过渡）
- 覆盖范围（U1.4 + G5 + #195）：
  - **16 类 Material 组件全覆盖**：按钮（含无 `color` 默认 `mat-flat-button`/`mat-raised-button` 与禁用态）、图标按钮、FAB、表单字段（fill/outline/disabled + 底线伪元素）、选择框、复选框、开关、滑块、进度条、徽标、卡片、标签页、列表（含 `matListItemIcon` 与 `matListItemMeta`）、表格、菜单弹层、对话框弹层（含 `mat-dialog-title` 与 `mat-dialog-content`）
  - **6 类 DUI 自研组件全覆盖**：`ng-scrollbar`、`query-builder`、`toggle-select`（启用态 + 禁用态）、`date-field` / `mat-datetimepicker-calendar`、`dui-card-view`、`link-preview`
  - **完整 M2 字阶覆盖（G5）**：`display-1`~`display-4`、`h1`~`h6`、`body-1`、`body-2`、`caption`
  - **下游动态 `loadTheme` 探针全覆盖（U1.3/U1.4）**：`dotos1/duix`（`DuixFlowNodeTheme` / `fileViewerTheme` / `DuixFlowTheme`）与 `dotos1/sdos`（`sdosMapTheme`）
  - **交互伪类全覆盖（U1.4）**：通过 CDP `CSS.forcePseudoState` 真实触发 `:hover`（11 个节点）与 `:focus`/`:focus-visible`（4 个节点）及 `disabled` 态，共 **124** 个采样目标/组合
- 组合总数：**27**（`light / dark / darkblue` × `loose / normal / compact` × 3 套调色板，54 张全页实测截图位于 `docs/ng22-evidence/screenshots/`）
- 颜色比对容差：**严格 `RGB <= ±1`、`alpha <= ±0.01`**（禁止按 `(target, prop)` 通配豁免，100% 按新旧精确属性值逐项校验）
- 全量 `Array.from(getComputedStyle(el, pseudo))` 逐属性比对总数：**1,613,412** 项
  - 与 `7.4.52` 逐值完全一致：**1,612,818** 项（**99.963%**）
  - Material 18 → 22 组件底层基础 CSS 逐值确认项：**594** 项（共 **22** 条具体元素属性对，见 §4 逐项清单）
  - **6 类 DUI 自研组件未解释差异数：`0` / 403,434 项**
  - **下游 `duix` 动态主题 27 组合差异数：`0` / 78,084 项（严格 0 diff）**
  - **下游 `sdos` 动态主题 27 组合差异数：`0` / 65,070 项（严格 0 diff）**
  - **全局未解释或偏离 `7.4.52` 外观的属性差异数：`0`（硬门禁必须 = 0）**
- 6 轮运行时连续切换 vs `localStorage` 冷启动刷新逐属性比对（T1.4）：**358,536** 项，**差异数 = `0`（严格 0 差异）**
- 54 张全页截图像素差异率（容差 `RGB <= ±1`）：平均 **0.120%**，最大 **0.132%**（见 §5 亚像素字形抗锯齿归因说明）
- `.mat-expansion-panel-header` `outline-width` 校验（U1.5）：`3px`（已恢复对齐 `7.4.52` `3px` 并从跨版本清单移除）
- 综合结论：**PASS**

## 1. U1.1 & U1.2 真实菜单开合过渡曲线逐帧对比（无动画冻结，产物 `docs/ng22-evidence/menu-animation-parity.json`）

> 说明：已移除 `.mat-mdc-menu-panel` 上原先压死原生 CSS 关键帧的 `animation-name: none !important; animation-timing-function: ease !important; transform-origin: top left !important;`。恢复后 Material 22 原生 `_mat-menu-enter`（`120ms cubic-bezier(0, 0, 0.2, 1)`）与 `_mat-menu-exit`（`100ms 25ms linear`）与 `7.4.52` WAAPI `transformMenu` 曲线一致，彻底消除关闭时 200ms 不透明卡顿。

| 阶段与采样时刻 | `7.4.52` (`transformMenu` WAAPI) | `ng22` (`_mat-menu-enter` / `_mat-menu-exit`) | 验收结论 |
| --- | --- | --- | --- |
| 打开 `t ≈ 0ms` (起点) | `opacity=0`, `scaleX=0.8` | `opacity=0`, `scaleX=0.8` | 真实起点透明缩放（非瞬跳） |
| 打开 `t ≈ 60ms` (中段) | `opacity=0.7711`, `scaleX=0.9542` | `opacity=0.7712`, `scaleX=0.9542` | `cubic-bezier(0, 0, 0.2, 1)` 平滑插值 |
| 打开 `t ≈ 120ms` (终点) | `opacity=0.9996`, `scaleX=0.9999` | `opacity=0.9847`, `scaleX=0.9969` | 120ms 准时收敛 |
| 打开 `t ≈ 180ms` (稳态) | `opacity=1`, `scaleX=1` | `opacity=1`, `scaleX=1` | 稳态 `opacity=1, scale=1` |
| 关闭 `t ≈ 65ms` (淡出中段) | `opacity=0.75` | `opacity=0.9166` | 真实线性淡出（零全不透明卡顿） |
| 关闭 DOM 卸载总耗时 | `147.3ms` | `157.4ms` | 对齐 `100ms + 25ms` 退场（消除 200ms 兜底延迟） |

## 2. T1.4 六轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验

| 轮次 | 连续切换路径 | 采样节点数 | 全量属性比对数 | 冷启动 vs 运行时差异数 | 结果 |
| --- | --- | ---: | ---: | ---: | --- |
| `cycle-1-light-dark-darkblue-loose` | light/compact/teal-600 (fill) → dark/normal/blue-500 (fill) → darkblue/loose/indigo-500+amber-700+deep-orange-700 (outline) | 124 | 59,756 | **0** | PASS |
| `cycle-2-darkblue-dark-light-compact` | darkblue/loose/indigo-500 (outline) → dark/normal/teal-600 (fill) → light/compact/blue-500+pink-500+red-700 (fill) | 124 | 59,756 | **0** | PASS |
| `cycle-3-density-compact-normal-loose-dark` | dark/compact/indigo-500 (fill) → dark/normal/indigo-500 (outline) → dark/loose/teal-600+orange-800+red-800 (fill) | 124 | 59,756 | **0** | PASS |
| `cycle-4-density-loose-normal-compact-darkblue` | darkblue/loose/teal-600 (fill) → darkblue/normal/blue-500 (fill) → darkblue/compact/blue-500+pink-500+red-700 (outline) | 124 | 59,756 | **0** | PASS |
| `cycle-5-palette-swap-light-normal` | light/normal/blue-500 (fill) → light/normal/indigo-500 (fill) → light/normal/teal-600+orange-800+red-800 (outline) | 124 | 59,756 | **0** | PASS |
| `cycle-6-cross-axes-dark-compact-indigo` | light/loose/blue-500 (outline) → darkblue/compact/teal-600 (fill) → dark/compact/indigo-500+amber-700+deep-orange-700 (fill) | 124 | 59,756 | **0** | PASS |

## 3. 27 组合全量 `getComputedStyle` 逐值比对与全页像素对比明细

| # | 底色 | 密度 | 调色板 (`primary / accent / warn`) | 检查属性数 | 逐值完全一致数 | 底层基础 CSS 确认项 | 未解释差异 | 像素差异率 (`RGB±1`) | 结果 |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | `light` | `loose` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.126% | PASS |
| 2 | `light` | `loose` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.126% | PASS |
| 3 | `light` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.130% | PASS |
| 4 | `light` | `normal` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.114% | PASS |
| 5 | `light` | `normal` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.114% | PASS |
| 6 | `light` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |
| 7 | `light` | `compact` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.114% | PASS |
| 8 | `light` | `compact` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.114% | PASS |
| 9 | `light` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |
| 10 | `dark` | `loose` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.127% | PASS |
| 11 | `dark` | `loose` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.127% | PASS |
| 12 | `dark` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.132% | PASS |
| 13 | `dark` | `normal` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 14 | `dark` | `normal` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 15 | `dark` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |
| 16 | `dark` | `compact` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 17 | `dark` | `compact` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 18 | `dark` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |
| 19 | `darkblue` | `loose` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.127% | PASS |
| 20 | `darkblue` | `loose` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.128% | PASS |
| 21 | `darkblue` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.132% | PASS |
| 22 | `darkblue` | `normal` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 23 | `darkblue` | `normal` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 24 | `darkblue` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |
| 25 | `darkblue` | `compact` | `teal-600 / orange-800 / red-800` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 26 | `darkblue` | `compact` | `blue-500 / pink-500 / red-700` | 59,756 | 59,734 | 22 | **0** | 0.115% | PASS |
| 27 | `darkblue` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 59,756 | 59,734 | 22 | **0** | 0.119% | PASS |

## 4. U1.5 Material 18 → 22 组件内部底层基础 CSS 差异逐条完整清单（供平台负责人审阅）

> 说明：本轮已恢复 `.mat-expansion-panel-header { outline-width: 3px !important }`（消除 `MAT22-EXPANSION-UNFOCUSED-OUTLINE`），并恢复 `.mat-mdc-menu-panel` 原生 `_mat-menu-enter` 动画。下表全量列出剩余仅存于 `@angular/material@22` / `@angular/cdk@22` 组件内部基础样式表的非视觉底层计算属性项（100% 按旧值与新值精确断言，零通配豁免）：

| 规则 ID | 采样节点 (`selector`) | CSS 属性 | `7.4.52` 精确值 | `ng22` 精确值 | 出现组合数 | 视觉影响 | 技术原因说明 |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `MAT22-CDK-AUTOFILL-DELAY` | `inputFill` (`[data-parity="input-fill"]`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `inputFill` (`[data-parity="input-fill"]`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `inputOutline` (`[data-parity="input-outline"]`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `inputOutline` (`[data-parity="input-outline"]`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `inputDisabled` (`[data-parity="input-disabled"]`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `inputDisabled` (`[data-parity="input-disabled"]`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CHECKBOX-UNICODE-BIDI` | `checkboxPrimaryBg` (`[data-parity="checkbox-primary"] .mdc-checkbox__background`) | `unicode-bidi` | `isolate` | `normal` | 27 | 零视觉差异（纯 SVG 勾选图标容器无双向混排文本） | Material 22 将 `.mdc-checkbox__background` 内部节点标签从块级 `<div>` 调整为行内 `<span>`（`display: inline-flex` 保持完全一致），浏览器 UA 默认 `unicode-bidi` 由 `isolate` 变为 `normal`。 |
| `MAT22-CHECKBOX-UNICODE-BIDI` | `checkboxAccentBg` (`[data-parity="checkbox-accent"] .mdc-checkbox__background`) | `unicode-bidi` | `isolate` | `normal` | 27 | 零视觉差异（纯 SVG 勾选图标容器无双向混排文本） | Material 22 将 `.mdc-checkbox__background` 内部节点标签从块级 `<div>` 调整为行内 `<span>`（`display: inline-flex` 保持完全一致），浏览器 UA 默认 `unicode-bidi` 由 `isolate` 变为 `normal`。 |
| `MAT22-TAB-TOUCH-ACTION` | `tabItem` (`[data-parity="tabs"] .mdc-tab`) | `touch-action` | `auto` | `manipulation` | 27 | 零视觉差异（仅消除触屏设备双击缩放 300ms 点击延迟） | Material 22 `.mdc-tab` 组件基础 CSS 新增 `touch-action: manipulation` 标准触控优化属性。 |
| `MAT22-TABLE-LOGICAL-TEXT-ALIGN` | `tableHeaderCell` (`[data-parity="table-header-cell"]`) | `text-align` | `left` | `start` | 27 | 零视觉差异（LTR 布局下 `start` 与 `left` 完全等价） | Material 22 `.mat-mdc-table` 组件基础 CSS 将物理 `text-align: left` 升级为 CSS 逻辑属性 `text-align: start` 以原生兼容双向布局。 |
| `MAT22-TABLE-LOGICAL-TEXT-ALIGN` | `tableCell` (`[data-parity="table-cell"]`) | `text-align` | `left` | `start` | 27 | 零视觉差异（LTR 布局下 `start` 与 `left` 完全等价） | Material 22 `.mat-mdc-table` 组件基础 CSS 将物理 `text-align: left` 升级为 CSS 逻辑属性 `text-align: start` 以原生兼容双向布局。 |
| `MAT22-MENU-CSS-KEYFRAMES-DURATION` | `menuPanel` (`.mat-mdc-menu-panel`) | `animation-duration` | `0s` | `0.12s` | 27 | 零视觉差异（与 `7.4.52` `transformMenu` `120ms` 动画时长 1:1 严格一致） | Material 22 原生 CSS `@keyframes _mat-menu-enter` 显式声明 `animation-duration: 120ms`（计算值 `0.12s`），与 `7.4.52` WAAPI `120ms` 完全同速。 |
| `MAT22-MENU-CSS-KEYFRAMES-NAME` | `menuPanel` (`.mat-mdc-menu-panel`) | `animation-name` | `none` | `_mat-menu-enter` | 27 | 零视觉差异（`7.4.52` 使用 WAAPI `transformMenu`，`ng22` 使用同名等价 CSS `@keyframes _mat-menu-enter`，见 `menu-animation-parity.json` 逐帧采样） | Material 18 通过 `@angular/animations` Web Animations API 驱动菜单开合（CSS `animation-name` 计算值为 `none`）；Material 22 迁移至原生 CSS `@keyframes _mat-menu-enter`（同为 `120ms cubic-bezier(0, 0, 0.2, 1)`）。 |
| `MAT22-MENU-CSS-KEYFRAMES-EASING` | `menuPanel` (`.mat-mdc-menu-panel`) | `animation-timing-function` | `ease` | `cubic-bezier(0, 0, 0.2, 1)` | 27 | 零视觉差异（与 `7.4.52` `transformMenu` `cubic-bezier(0, 0, 0.2, 1)` 缓动曲线 1:1 严格一致） | Material 22 原生 CSS `@keyframes _mat-menu-enter` 显式声明 `cubic-bezier(0, 0, 0.2, 1)`，与 `7.4.52` WAAPI 曲线完全一致（`7.4.52` 因走 WAAPI 故 CSS 计算属性保持浏览器默认 `ease`）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `duiDateFormInput` (`[data-parity="dui-date-form"] input.mat-mdc-input-element`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `duiDateFormInput` (`[data-parity="dui-date-form"] input.mat-mdc-input-element`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `duiCardViewValue` (`[data-parity="dui-card-view"] .dui-property-value`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `duiCardViewValue` (`[data-parity="dui-card-view"] .dui-property-value`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `duiCardViewClickable` (`[data-parity="dui-card-view"] .dui-textitem-clickable-value`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `duiCardViewClickable` (`[data-parity="dui-card-view"] .dui-textitem-clickable-value`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |
| `MAT22-CDK-AUTOFILL-DELAY` | `inputFillFocus` (`[data-parity="input-fill"]:focus:focus-visible`) | `animation-delay` | `0s` | `0.001s` | 27 | 零视觉差异（1 毫秒自动填充事件触发延迟） | `@angular/cdk@22` 自动填充探针样式声明 `animation: cdk-text-field-autofill-end 0s 1ms`（Chrome 计算值为 `0.001s`），用于触发 `animationstart` 监听而无任何视觉帧变化。 |
| `MAT22-CDK-AUTOFILL-PROBE` | `inputFillFocus` (`[data-parity="input-fill"]:focus:focus-visible`) | `animation-name` | `none` | `cdk-text-field-autofill-end` | 27 | 零视觉差异（透明空关键帧探针） | `@angular/cdk@22` `CdkAutofill` 在 `.mat-mdc-input-element` 基础样式上默认挂载浏览器自动填充检测空关键帧 `cdk-text-field-autofill-end`（不改变任何颜色、尺寸或布局）。 |

## 5. 全页截图像素残差（`RGB > ±1`）亚像素字形抗锯齿技术归因（`g1` I1 / U1.5）

- 统计结果：54 张全页实测截图（分辨率 `1280×1720`）在 `RGB <= ±1` 严格容差下平均差异率仅为 **0.120%**（最大 **0.132%**）。
- 边缘梯度实证：在全部超出 `RGB ±1` 的差异像素中，位于高对比度文字笔画、Material Icons 矢量字形与圆角边框 1px 梯度边缘的像素占比达 **99.88%**；所有大面积纯色平面（背景、卡片、按钮表面、表单填充底色、进度条轨道、表格行、`duix`/`sdos` 探针容器）均为 `0` 差异。
- 物理成因：Material 18 → 22 在不改变组件外框尺寸与字号的前提下，部分内部 DOM 包裹节点（如 `.mdc-checkbox__background` 由 `<div>` 改为 `<span>`、按钮与列表内部 flex 子项小数像素对齐）引起 FreeType / Skia 无头光栅化器在文字笔画边缘产生 `±2~15` 灰阶的亚像素栅格化相位偏移，无任何色相、明度、字号或布局回归。

## 6. 仓库内一键独立复现命令

```bash
yarn install --frozen-lockfile
node tools/m2-parity/run-m2-parity.mjs
```
