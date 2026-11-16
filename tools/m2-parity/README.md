# `dui` M2 外观、6 类自研组件、下游动态主题与真实动画 27 组合对齐验证套件

本目录存放 `@dotos1/dui`（Angular 22 / Material 22 M2）与历史基线 `7.4.52`（`github/master`）的无头浏览器 27 组合外观、交互态、动态主题与菜单过渡动画 100% 对齐验证工具及固化基线数据：

- `generate-m2-tokens.mjs`：构建期哨兵调色板提取器。调用 `@angular/material@22` 官方 M2 Sass API（`mat.m2-define-light-theme`、`mat.m2-define-dark-theme`、`mat.all-component-colors`、`mat.all-component-densities`、`mat.color-variants-backwards-compatibility`）自动生成 `src/theme/m2-token-templates.ts` 与 `src/theming/_m2-system.scss`（零 HCT 算法，零 `--mat-sys-*` M3 系统变量）。
- `run-m2-parity.mjs`：真实无头 Chrome（CDP，**零全局动画冻结**）27 组合（`light / dark / darkblue` × `loose / normal / compact` × 3 套调色板）全属性 `getComputedStyle` 逐值比对、CDP `CSS.forcePseudoState` 真实触发 `:hover` 与 `:focus`/`:focus-visible` 交互态采样、`.mat-mdc-menu-panel` 开合动画逐帧采样（`0ms / 60ms / 120ms / 180ms` 与关闭淡出）、全页像素截图比对及 6 轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验脚本。
- `baseline-7452-styles.json.gz`：从 `github/master`（`7.4.52`）在同源 `/m2-parity` 视图下实测采集并压缩入库的 27 组合全量 `getComputedStyle` 与真实菜单开合动画曲线基线快照（共 123 个采样目标/组合，覆盖 16 类 Material 组件、6 类 DUI 自研组件 `ng-scrollbar` / `query-builder` / `toggle-select` / `date-field` / `dui-card-view` / `link-preview`、完整 M2 字阶 `display-1~4` 与 `h1~h6` 及 `body-1~2` / `caption`、下游 `duix` / `sdos` 动态 `loadTheme` 探针及交互伪类状态）。

## 1. 仓库内一键独立复现（无需任何外部目录）

在仓库根目录执行以下命令，脚本会自动校验/构建 `dist/dui` 与 `dist/testdui`，加载入库的 `tools/m2-parity/baseline-7452-styles.json.gz` 与 `docs/ng22-evidence/screenshots/*-7452.png` 基线，在无任何 `transition/animation` 冻结的真实环境中完成菜单开合动画采样、27 组合全属性逐值比对（颜色容差严格 `RGB <= ±1`）与 6 轮冷启动一致性校验，并将完整报告输出至 `docs/ng22-evidence/`：

```bash
yarn install --frozen-lockfile
npm run generate:m2-tokens
npm run parity:m2
```

等价直接调用：

```bash
node tools/m2-parity/run-m2-parity.mjs
```

产物全部位于仓库内 `docs/ng22-evidence/`：

- `docs/ng22-evidence/m2-parity-27-report.md`：真实菜单动画逐帧对比、27 组合全量 `getComputedStyle` 比对（含 6 类 DUI 组件与 `duix`/`sdos` 0 diff 汇总）、6 轮冷启动零差异校验、跨版本底层 CSS 逐值清单与亚像素字形抗锯齿归因报告。
- `docs/ng22-evidence/m2-parity-27-report.json`：结构化机读完整验收数据。
- `docs/ng22-evidence/menu-animation-parity.json`：`7.4.52` vs `ng22` 菜单打开（`0ms / 60ms / 120ms / 180ms`）与关闭淡出（`65ms` 中段透明度与 DOM 卸载耗时）逐帧对比数据。
- `docs/ng22-evidence/screenshots/`：27 组 `*-7452.png` 与 `*-ng22.png`（共 54 张全页实测截图）。

## 2. 从 `github/master`（`7.4.52`）重新采集对照基线（可选）

如需从零重算并更新 `tools/m2-parity/baseline-7452-styles.json.gz` 及 `docs/ng22-evidence/screenshots/*-7452.png`，可在相邻目录检出 `github/master` 工作树并传入 `--capture-ref-dir`：

```bash
git worktree add ../dui-ref-7452 github/master
(cd ../dui-ref-7452 && yarn install --frozen-lockfile)
node tools/m2-parity/run-m2-parity.mjs --capture-ref-dir ../dui-ref-7452
git worktree remove ../dui-ref-7452
```

`--capture-ref-dir` 会在检出的 `7.4.52` 工作树中临时挂载与当前分支完全同源的 `/m2-parity` 验收组件（采集结束后自动还原工作树干净状态），启动真实无头 Chrome 同步采集 `7.4.52` 真实菜单动画曲线、27 组合全量样式与截图并写入 `tools/m2-parity/baseline-7452-styles.json.gz`。

## 3. 字段失焦检查（`focus-blur-check.mjs`）

6.3.0 校核回归：form-card 里点字段 A 再点字段 B，A 仍高亮。Material 22 的 `mat-form-field` 只在控件 `stateChanges` 发出时刷新 `mat-focused` / `mdc-text-field--focused`，dui 的 `MatField` 失焦时没有发出。脚本在 testdui `/focus-check?formType=fill|outline` 宿主页上用真实鼠标点击逐对字段，断言前一个字段失焦后不再处于聚焦态（class、标签颜色、轮廓线宽、下划线高亮）：

```bash
npx ng build testdui --configuration development
node tools/m2-parity/focus-blur-check.mjs
```

7.4.52 对照：把 `projects/testdui/src/app/focus-check` 拷到 `github/master` 工作树（`@dotos1/` 改 `@dotos/`，加同名路由）构建后，加 `--dist <工作树>/dist/testdui/browser --mat-focused-only` 运行。7.4.52 的 `mat-focused` 是宿主绑定、随变更检测刷新，所以通过；它的内层 `mdc-text-field--focused` 同样靠 `stateChanges`，非必填字段本来就会残留，故对照只断言 `mat-focused`。
