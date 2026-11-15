# `@dotos1/dui` Angular 22 升级与 M2 外观 100% 还原仓库内验收证据索引

本目录存放 `@dotos1/dui`（PR `dotos1/dui#15`，分支 `fix/ng22-r2-dui` → `feat/ng22-m3`）全量实测验收证据，全部由仓库内脚本在无外部临时目录依赖下独立生成与复现。

## 1. 证据文件清单

| 证据文件 | 对应任务 / 审计项 | 内容说明 |
| --- | --- | --- |
| `m2-parity-27-report.md` | `T1` / `T4-1` / `G2` / `W3` | 真实无头 Chrome 27 组合（`light / dark / darkblue` × `loose / normal / compact` × 3 套调色板）68 个采样节点（含子层包装器与 `::before`/`::after` 伪元素）全量 `getComputedStyle` 逐值比对（颜色容差 `RGB <= ±1`）、6 轮运行时连续切换 vs `localStorage` 冷启动刷新零差异校验，以及 Material 18 → 22 底层基础 CSS 逐项精确清单 |
| `m2-parity-27-report.json` | `T1` / `T4-1` / `G2` / `W3` | 上述 27 组合与 6 轮冷启动校验的结构化机读完整报告 |
| `screenshots/` | `T1` / `W3` | 27 组 `*-7452.png`（`github/master` `7.4.52` 实测基线截图）与 `*-ng22.png`（当前分支实测截图），共 54 张全页 PNG 截图 |
| `w1-w2-w5-fesm2022-verify.json` | `W1` / `W2` / `W5` / `T4-1` / `T5` | `dist/dui` 产物包名 `@dotos1/dui`、零 `@dotos/dui` 残留、零 `--mat-sys-*` 残留、`--dui-theme-*` 动态根变量、`useDefineForClassFields: false`、`provideZoneChangeDetection` 及 `yarn.lock` 零本地私服校验报告 |
| `ci-gates-and-jest.log` | `W1` / `W2` / `W4` / `W6` / `I2` / `G3` / `T4-1` | 全量门禁（`gate:any`、`gate:tsc`、`gate:i18n`、`gate:jsdoc`、`gate:esm`、`gate:ng22-compat`、`gate:style-ref --selftest`、`gate:standalone`）与全套 Jest 单测完整输出日志 |
| `generate-m2-tokens-repro.log` | `I3` / `W3` / `T4-1` | `node tools/m2-parity/generate-m2-tokens.mjs && git diff --exit-code` 构建期哨兵模板零差异可复现日志 |
| `yarn-frozen-lockfile.log` | `I3` / `W5` | `yarn install --frozen-lockfile` 依赖锁定一致性日志 |
| `ts-suppress-gate.log` | `T6` | 类型压制棘轮门禁校验日志（`.ts-suppress-baseline.json` 下调收敛验证） |
| `scan-secrets.log` | 安全红线 | 密钥与敏感凭据扫描零泄漏验证日志 |

## 2. 一键复现命令（仓库根目录执行）

```bash
# 1. 依赖一致性与哨兵模板复现校验
yarn install --frozen-lockfile
npm run generate:m2-tokens
git diff --exit-code -- src/theme/m2-token-templates.ts src/theming/_m2-system.scss

# 2. 构建 @dotos1/dui 并校验产物与配置硬门禁
npm run build-dui
node tools/ng-upgrade/verify-dist-fesm2022.mjs

# 3. 运行全量静态门禁、样式死变量/M3 系统变量拦截自检与 Jest 单元测试
npm run gate:any
npm run gate:tsc
npm run gate:i18n
npm run gate:jsdoc
npm run gate:esm
npm run gate:ng22-compat
node tools/ng-upgrade/style-ref-gate.mjs --selftest
npm run gate:standalone
npx jest --runInBand

# 4. 运行真实无头 Chrome 27 组合全量 getComputedStyle 与 6 轮冷启动一致性验收
npm run parity:m2
```
