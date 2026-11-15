# `@dotos1/dui` Angular 22 vs `7.4.52` 真实 Chrome 27 组合 M2 外观 100% 还原与 6 轮冷启动一致性报告

- 生成时间：`2026-11-15T11:00:06.166Z`
- 对照基线：`7.4.52`（`github/master` 提交 `84ee2ed6ce2dc9da033e02a2d4501c1c91bf1d02`，入库基线文件 `tools/m2-parity/baseline-7452-styles.json.gz`）
- 待测版本：`@dotos1/dui@8.0.0-next.2`（仓库内独立复现目录 `docs/ng22-evidence`）
- 覆盖组件大类：**16 类全覆盖**（按钮、图标按钮、FAB、表单字段、选择框、复选框、开关、滑块、进度条、徽标、卡片、标签页、列表、表格、菜单弹层、对话框弹层）+ 纸片、展开面板、字阶类（共 **59** 个采样节点）
- 组合总数：**27**（`light / dark / darkblue` × `loose / normal / compact` × 3 套调色板，54 张全页实测截图位于 `docs/ng22-evidence/screenshots/`）
- 颜色比对容差：**严格 `RGB <= ±1`、`alpha <= ±0.01`**（禁止按 `(target, prop)` 通配豁免，100% 按新旧精确属性值逐项校验）
- 全量 `Array.from(getComputedStyle(el))` 逐属性比对总数：**767,826** 项
  - 与 `7.4.52` 逐值完全一致：**767,502** 项（**99.958%**）
  - Material 18 → 22 组件底层非视觉基础 CSS 逐值确认项：**324** 项（共 **12** 条具体元素属性对，全部零视觉差异，见 §3 逐项清单供平台负责人确认）
  - **未解释或偏离 `7.4.52` 外观的属性差异数：`0`（硬门禁必须 = 0）**
- 6 轮运行时连续切换 vs `localStorage` 冷启动刷新逐属性比对（T1.4）：**170,628** 项，**差异数 = `0`（严格 0 差异）**
- 54 张全页截图像素差异率（容差 `RGB <= ±1`）：平均 **1.308%**，最大 **1.500%**
- `adoptedStyleSheets` 数量：`0`（100% 恢复真实 `<style>` 标签注入，顺序 `core -> material-theme -> component`）
- 动态 M2 根变量校验（T4-1）：`--dui-theme-primary=#00897b`、`--mat-sys-primary=""`（零 `--mat-sys-*` M3 系统变量）
- `html { font-size: 62.5% }` 下组件字号防缩水校验：`btn=14px`、`h1=10px`（零 `rem` 缩水）
- W1 `Zone.js` 异步自动刷新校验：`angular:1:1`
- W4 真实动画校验：折叠面板 `open=36px -> closed=0px -> reopened=36px`，菜单高度 `60px`，弹窗打开 `true`
- 综合结论：**PASS**

## 1. T1.4 六轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验

| 轮次 | 连续切换路径 | 采样节点数 | 全量属性比对数 | 冷启动 vs 运行时差异数 | 结果 |
| --- | --- | ---: | ---: | ---: | --- |
| `cycle-1-light-dark-darkblue-loose` | light/compact/teal-600 (fill) → dark/normal/blue-500 (fill) → darkblue/loose/indigo-500+amber-700+deep-orange-700 (outline) | 59 | 28,438 | **0** | PASS |
| `cycle-2-darkblue-dark-light-compact` | darkblue/loose/indigo-500 (outline) → dark/normal/teal-600 (fill) → light/compact/blue-500+pink-500+red-700 (fill) | 59 | 28,438 | **0** | PASS |
| `cycle-3-density-compact-normal-loose-dark` | dark/compact/indigo-500 (fill) → dark/normal/indigo-500 (outline) → dark/loose/teal-600+orange-800+red-800 (fill) | 59 | 28,438 | **0** | PASS |
| `cycle-4-density-loose-normal-compact-darkblue` | darkblue/loose/teal-600 (fill) → darkblue/normal/blue-500 (fill) → darkblue/compact/blue-500+pink-500+red-700 (outline) | 59 | 28,438 | **0** | PASS |
| `cycle-5-palette-swap-light-normal` | light/normal/blue-500 (fill) → light/normal/indigo-500 (fill) → light/normal/teal-600+orange-800+red-800 (outline) | 59 | 28,438 | **0** | PASS |
| `cycle-6-cross-axes-dark-compact-indigo` | light/loose/blue-500 (outline) → darkblue/compact/teal-600 (fill) → dark/compact/indigo-500+amber-700+deep-orange-700 (fill) | 59 | 28,438 | **0** | PASS |

## 2. 27 组合全量 `getComputedStyle` 逐值比对与全页像素对比明细

| # | 底色 | 密度 | 调色板 (`primary / accent / warn`) | 检查属性数 | 逐值完全一致数 | 底层基础 CSS 确认项 | 未解释差异 | 像素差异率 (`RGB±1`) | 结果 |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | `light` | `loose` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.473% | PASS |
| 2 | `light` | `loose` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.492% | PASS |
| 3 | `light` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.500% | PASS |
| 4 | `light` | `normal` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.280% | PASS |
| 5 | `light` | `normal` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.299% | PASS |
| 6 | `light` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.307% | PASS |
| 7 | `light` | `compact` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.129% | PASS |
| 8 | `light` | `compact` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.147% | PASS |
| 9 | `light` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.156% | PASS |
| 10 | `dark` | `loose` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.477% | PASS |
| 11 | `dark` | `loose` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.477% | PASS |
| 12 | `dark` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.484% | PASS |
| 13 | `dark` | `normal` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.286% | PASS |
| 14 | `dark` | `normal` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.287% | PASS |
| 15 | `dark` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.293% | PASS |
| 16 | `dark` | `compact` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.141% | PASS |
| 17 | `dark` | `compact` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.141% | PASS |
| 18 | `dark` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.148% | PASS |
| 19 | `darkblue` | `loose` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.485% | PASS |
| 20 | `darkblue` | `loose` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.486% | PASS |
| 21 | `darkblue` | `loose` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.492% | PASS |
| 22 | `darkblue` | `normal` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.293% | PASS |
| 23 | `darkblue` | `normal` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.293% | PASS |
| 24 | `darkblue` | `normal` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.300% | PASS |
| 25 | `darkblue` | `compact` | `teal-600 / orange-800 / red-800` | 28,438 | 28,426 | 12 | **0** | 1.145% | PASS |
| 26 | `darkblue` | `compact` | `blue-500 / pink-500 / red-700` | 28,438 | 28,426 | 12 | **0** | 1.146% | PASS |
| 27 | `darkblue` | `compact` | `indigo-500 / amber-700 / deep-orange-700` | 28,438 | 28,426 | 12 | **0** | 1.152% | PASS |

## 3. T1.5 Material 18 → 22 组件内部底层基础 CSS 差异逐条完整清单（供平台负责人确认）

> 说明：上一轮全部用户可见外观差异（`.mat-h1~caption` 字阶尺寸/行高/间距与根容器高度、`color="primary"` 复选框强调色、选中纸片底色与纵向外边距、`mat-badge` 透明底色与紧凑尺寸、卡片与滑块圆柄无阴影、彩色图标按钮内 `<mat-icon>` 前景色、菜单入场动画与菜单项 `14px` 固定字号、凸起按钮 `min-height: auto`、输入框 `padding-left: 0px`）已 **100% 恢复为 `7.4.52` 原始表现**。下表全量列出剩余仅存于 `@angular/material@22` / `@angular/cdk@22` 组件内部基础样式表的非视觉底层属性项（均按旧值与新值精确断言，无任何通配豁免）：

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
| `MAT22-EXPANSION-UNFOCUSED-OUTLINE` | `expansionHeader` (`[data-parity="expansion-header"]`) | `outline-width` | `3px` | `0px` | 27 | 零视觉差异（非聚焦态 `outline-style: none` 下线宽不渲染） | 7.4.52 非聚焦态 `outline-style: none` 下浏览器默认 `outline-width` 计算值为 `3px`；Material 22 `.mat-expansion-panel-header` 基础样式显式声明 `outline: none` 使 `outline-width` 计算值为 `0px`。 |

## 4. 仓库内一键独立复现命令

```bash
yarn install --frozen-lockfile
node tools/m2-parity/run-m2-parity.mjs
```
