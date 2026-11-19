# `@dotos/dui` 8.0.0 发布与合规自检指南 / Release & Verification Guide

本文档规范 `@dotos/dui`（内部仓库构建作用域别名：`@dotos1/dui`）`8.0.0` 及后续版本的构建、全量门禁验证、公网 npm 产物生成与双通道发布流程。

---

## 1. 产物架构概览（双通道同源构建）

仓库采用“单一源码、双产物目录”机制，确保内部工程协作与公网 npm 开源分发完全同源且零配置泄漏：

| 构建目标 | 输出目录 | 包名（`name`） | 生成命令 | 用途说明 |
| :--- | :--- | :--- | :--- | :--- |
| **内部构建产物** | `dist/dui` | `@dotos1/dui` | `npm run build-dui` | 遵循 Angular Package Format（FESM2022），供内部 GitHub Packages CI 流水线（`.github/workflows/package-ci.yml`）验证与消费 |
| **公网开源产物** | `dist/dui-public` | `@dotos/dui` | `npm run build:public-npm` | 自动从 `dist/dui` 复制并重写作用域为 `@dotos/dui`、注入 `LICENSE` / `README.md` / `THIRD-PARTY-NOTICES.md` / `llms.txt`、移除内部脚本，并执行零私服/内网残留自检与 `npm pack --dry-run` 验证 |

---

## 2. 发布前全量门禁与单测清单（必须 100% EXIT 0）

在切出发布分支或提交发版前，必须在干净工作区依次通过以下全部自动化检查：

```bash
# 1. Jest 单元测试（覆盖安全表达式 safe-expr、AST 解析器、动态组件、M2 动态主题等）
npm run test:jest

# 2. 96 个入口点（1 根入口 + 95 二级入口）TypeScript 严格编译检查
npm run gate:tsc

# 3. 12 语种国际化词典键集合对齐与翻译完整性门禁
npm run gate:i18n

# 4. 16,900+ 处中英双语 JSDoc 类型同步与措辞门禁
npm run gate:jsdoc

# 5. 纯 ESM 导入门禁（严禁 CommonJS lodash / lodash/fp 导入）
npm run gate:esm

# 6. TypeScript Checker 真实 any / 空对象 {} / 双重断言棘轮自检与基线门禁
npm run gate:any:selftest && npm run gate:any

# 7. Angular 22 兼容门禁（禁废弃 API、禁 JSS 回流、强制 Ivy Partial 与 ::ng-deep 基线）
npm run gate:ng22-compat

# 8. Angular Material 22 样式引用门禁
npm run gate:style-ref

# 9. NgModule 组件/指令显式 standalone: false 一致性门禁
npm run gate:standalone

# 10. AI 契约文档门禁（AST 校验 src/llms.txt 95 个入口、TS 示例编译、选择器与公开绑定别名）
npm run gate:llms

# 11. 底层工具与原生 Intl 格式化黄金对照门禁
node tools/base/gate.mjs && node tools/intl/gate.mjs

# 12. CSP 合规核验（确认 src/ 生产源码零 Function() / new Function 调用）
grep -rn "new Function\|\bFunction(" src/ --exclude="*.spec.ts" # 期望无任何匹配（0 行）

# 13. 执行 APF 生产构建并校验产物依赖清零门禁
npm run build-dui
npm run gate:pkg-deps

# 14. 生成公网 @dotos/dui 产物并执行零残留合规自检
node tools/build-public-npm.mjs
```

---

## 3. 版本号对齐规范

正式发版前需保持以下位置版本号一致（例如 `8.0.0`）：
1. 根目录 `package.json` 中的 `"version"`；
2. 库清单 `src/package.json` 中的 `"version"`；
3. `node tools/build-public-npm.mjs --version 8.0.0`（默认即为 `8.0.0`，支持显式传入 `--version <semver>`）。

> **注意**：`src/package.json` 中的 `prebuild` 脚本仅在执行 `npm run package`（内部自动补丁号流程）时触发；执行 `npm run build-dui` 与 `npm run build:public-npm` **不会**自动篡改已对齐的语义化版本号。

---

## 4. 公网 npm（`@dotos/dui`）发布操作步骤

> **安全红线**：自动化构建脚本与日常 CI 严禁直接执行公网 `npm publish`，发布须由拥有 npm `@dotos` 组织权限的发布负责人在人工复核通过后执行。

1. 执行完整构建与公网合规流水线：
   ```bash
   npm run build:public-npm
   ```
2. 人工核对终端输出的合规报告，确认：
   - 包名与版本为 `@dotos/dui@8.0.0`；
   - `0 @dotos1/ 残留`、`0 内网/私服残留`；
   - `dist/dui-public` 内包含非空的 `LICENSE`、`README.md`、`THIRD-PARTY-NOTICES.md`、`llms.txt` 且 `package.json` 含 `"exports": { "./llms.txt": ... }`。
3. 进入 `dist/dui-public` 执行干跑或正式发布：
   ```bash
   cd dist/dui-public
   npm pack --dry-run
   # 复核无误后由授权维护者执行：
   # npm publish --access public --registry https://registry.npmjs.org/
   ```
   若发布预发布版本（如 `8.1.0-next.0`），请显式指定 `--tag next`，切勿覆盖公网 `latest` 标签。

---

## 5. GitHub Packages 内部流水线发布说明

仓库 `.github/workflows/package-ci.yml` 在自托管 Runner 上自动运行全部门禁与构建：
- **PR 与分支推送**：仅运行全套门禁、`build-dui` 与 `gate:pkg-deps`，不触发发布；
- **手动指定版本发布（`workflow_dispatch`）**：勾选 `publish: true` 并填写 `version`（含 `-` 预发布后缀时自动发布到 `next` dist-tag，正式版发布到 `latest` dist-tag）；
- **Tag 触发发布**：推送 `v*` 标签时按 `dist/dui/package.json` 版本自动判定 `latest` 或 `next` 标签并发布。
