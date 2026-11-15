# `dui` M2 外观与动态主题 27 组合全量对齐验证套件

本目录存放 `@dotos1/dui`（Angular 22 / Material 22 M2）与历史基线 `7.4.52`（`github/master`）的无头浏览器 27 组合外观与动态主题 100% 对齐验证工具及固化基线数据：

- `generate-m2-tokens.mjs`：构建期哨兵调色板提取器。调用 `@angular/material@22` 官方 M2 Sass API（`mat.m2-define-light-theme`、`mat.m2-define-dark-theme`、`mat.all-component-colors`、`mat.all-component-densities`、`mat.color-variants-backwards-compatibility`）自动生成 `src/theme/m2-token-templates.ts` 与 `src/theming/_m2-system.scss`（零 HCT 算法，零 `--mat-sys-*` M3 系统变量）。
- `run-m2-parity.mjs`：真实无头 Chrome（CDP）27 组合（`light / dark / darkblue` × `loose / normal / compact` × 3 套调色板）全属性 `getComputedStyle` 逐值比对、全页像素截图比对与 6 轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验脚本。
- `baseline-7452-styles.json.gz`：从 `github/master`（`7.4.52`）在相同 `/m2-parity` 16 类组件大观路由（68 个采样节点，覆盖根宿主、内部子层包装器及 `::before`/`::after` 伪元素）下实测采集并压缩入库的 27 组合全量 `getComputedStyle` 基线快照（含 `7.4.52` 提交哈希与 27 张 `docs/ng22-evidence/screenshots/*-7452.png` 基线截图）。

## 1. 仓库内一键独立复现（无需任何外部目录）

在仓库根目录执行以下命令，脚本会自动校验/构建 `dist/dui` 与 `dist/testdui`，加载入库的 `tools/m2-parity/baseline-7452-styles.json.gz` 与 `docs/ng22-evidence/screenshots/*-7452.png` 基线，完成 27 组合全属性逐值比对（颜色容差严格 `RGB <= ±1`）与 6 轮冷启动一致性校验，并将完整报告输出至 `docs/ng22-evidence/`：

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

- `docs/ng22-evidence/m2-parity-27-report.md`：27 组合全量 `getComputedStyle` 比对、6 轮冷启动零差异校验及跨版本底层 CSS 逐值清单报告。
- `docs/ng22-evidence/m2-parity-27-report.json`：结构化机读完整验收数据。
- `docs/ng22-evidence/screenshots/`：27 组 `*-7452.png` 与 `*-ng22.png`（共 54 张全页实测截图）。

## 2. 从 `github/master`（`7.4.52`）重新采集对照基线（可选）

如需从零重算并更新 `tools/m2-parity/baseline-7452-styles.json.gz` 及 `docs/ng22-evidence/screenshots/*-7452.png`，可在相邻目录检出 `github/master` 工作树并传入 `--capture-ref-dir`：

```bash
git worktree add ../dui-ref-7452 github/master
(cd ../dui-ref-7452 && yarn install --frozen-lockfile)
node tools/m2-parity/run-m2-parity.mjs --capture-ref-dir ../dui-ref-7452
git worktree remove ../dui-ref-7452
```

`--capture-ref-dir` 会在检出的 `7.4.52` 工作树中临时挂载与当前分支完全同源的 `/m2-parity` 验收组件（采集结束后自动还原工作树干净状态），启动真实无头 Chrome 同步采集 `7.4.52` 27 组合全量样式与截图并写入 `tools/m2-parity/baseline-7452-styles.json.gz`。
