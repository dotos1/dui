# `@dotos1/mcp` (`8.0.0-next.1`)

> **DOTOS Angular 22 组件库（`@dotos/dui`、`@dotos/duix`、`@dotos/xdraw`）官方闭环自愈 MCP Server**

`@dotos1/mcp` 基于标准 Model Context Protocol (`@modelcontextprotocol/sdk@1.32.2`) 与 `typescript@6.0.3` 严格零 `any` 契约构建，面向 AI 编程代理（Antigravity、Claude Code、Cursor 等）提供**组件精准选型、零幻觉 Signal API 检索、单文件可编译黄金示例生成**以及**复杂控件 JSON Schema 闭环自愈校验**能力。

---

## 快速接入（零配置 Stdio 启动）

支持直接通过 `npx @dotos1/mcp` 或全局安装后的 `dotos-mcp` / `mcp` 命令零配置拉起标准 Stdio 传输服务。

### 1. Antigravity 配置 (`mcp_config.json`)

```json
{
  "mcpServers": {
    "dotos-mcp": {
      "command": "npx",
      "args": ["-y", "@dotos1/mcp@8.0.0-next.1"]
    }
  }
}
```

### 2. Cursor 配置 (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "dotos-mcp": {
      "command": "npx",
      "args": ["-y", "@dotos1/mcp@8.0.0-next.1"]
    }
  }
}
```

### 3. Claude Code 配置 (`.mcp.json` 或 CLI 注册)

通过命令行一键注册：

```bash
claude mcp add dotos-mcp -- npx -y @dotos1/mcp@8.0.0-next.1
```

或在项目根目录 `.mcp.json` 中声明：

```json
{
  "mcpServers": {
    "dotos-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@dotos1/mcp@8.0.0-next.1"]
    }
  }
}
```

---

## 三大核心 MCP 工具契约

### 1. `list_dotos_components` — 组件目录与选型决策矩阵

按包名、业务分类、Zoneless 兼容性或关键词检索组件目录与选型决策表：

- **输入参数（均可选）**：
  - `package`: `'all' | '@dotos/dui' | '@dotos/duix' | '@dotos/xdraw'`
  - `category`: `'form' | 'data-grid' | 'bi-analytics' | 'gantt-schedule' | 'layout-dock' | 'navigation-tree' | 'diagram-2d' | 'feedback'`
  - `zonelessOnly`: `boolean`
  - `query`: `string`
- **覆盖范围**：
  - `@dotos/dui/standalone`（MIT 开源基础包）：`<dui-standalone-button>`、`<dui-standalone-card>`、`<dui-standalone-tabs>`、`<dui-standalone-split-dock>`、`<dui-standalone-tree>`、`<dui-standalone-form>`
  - `@dotos/duix/standalone`（企业级高密度数据与 BI Pro 包）：`<duix-standalone-grid>`、`<duix-standalone-pivot-grid>`、`<duix-standalone-gantt>`
  - `@dotos/xdraw/standalone`（2D 工业组态与拓扑画布包）：`<xdraw-standalone-canvas>`

### 2. `get_component_api_and_example` — 零 `any` Signal 契约与单文件黄金示例

具备智能别名归一化能力（如传入 `'duix-standalone-grid'`、`'duix-grid'`、`'<xdraw-canvas>'` 或 `'DuixGridStandaloneComponent'` 均可精准解析；若传入未知名称则返回最相近候选与 `hint`）：

- 标准导入子路径（如 `@dotos/duix/standalone` + `@dotos/duix/schema`）
- 全量零 `any` Signal 端口签名（`input()` / `model()` / `output()`）
- **Headless Command API** 无头控制方法签名（如网格 `applyFilter`/`applySort`/`clearFilters`/`exportCsv`；甘特图 `scrollToTask`/`setZoomLevel`/`exportSchedule`；工业画布 `highlightNodes`/`autoLayout`/`exportSvg`/`fitView`）
- Material 3 与 DOTOS 公开 CSS 变量定制钩子（`--mat-sys-*` / `--dui-*`）
- Angular 22 强制反模式禁令（100% `Standalone + Signals + ChangeDetectionStrategy.OnPush`，严禁 `NgModule`、严禁假设 `Zone.js`、严禁 `::ng-deep`/`.mdc-*`、严禁 `fxLayout`、严禁 `any`）
- **最小可独立编译的单文件黄金组件完整 TypeScript 源码**

### 3. `validate_schema` — 复杂组件 Schema 闭环自愈校验器

复刻并增强 `dotos.customizer` 闭环自愈体验，内置五大复杂控件的 **Draft 2020-12 JSON Schema** 与深度语义校验器：

- **支持目标 (`target`)**：`'dui-form' | 'duix-grid' | 'duix-pivot-grid' | 'duix-gantt' | 'xdraw-canvas'`
- **典型 AI 幻觉自愈拦截**：
  - `dui-form`：缺失 `fields`、重复字段 `key`、误写 `'textfield'`/`'dropdown'`（自动指引改为 `'text'`/`'select'`）、`select` 缺失 `options`、`min > max`
  - `duix-grid`：缺失 `columns`（或误写 `columnDefs`）、列缺失 `field`/`header`（或误写 `dataIndex`/`title`）、列重复 `field`、把宽度写成 `'160px'` 字符串而非数字或合法百分比、开启虚拟滚动未配 `rowKey` 警告
  - `duix-pivot-grid`：缺失 `rows`/`columns`/`measures`、非法 `aggregator` 聚合枚举（指引 `'sum' | 'avg' | 'count' | 'min' | 'max'`）
  - `duix-gantt`：任务缺失 `id`/`name`/`startDate`/`endDate`、`endDate < startDate` 时序倒置、`progress` 超出 `0..100`、`dependencies` 引用不存在的前置任务 `id`
  - `xdraw-canvas`：节点缺失唯一 `id` 或顶层坐标 `x`/`y`（拦截嵌套 `position` 幻觉）、连线 `edges` 的 `source`/`target` 引用不存在节点（悬空边检测）、未知布局算法（指引 `'dagre' | 'grid' | 'circular' | 'force'`）

---

## 编程式调用示例

除 CLI 启动外，`@dotos1/mcp` 亦可作为标准 ESM 库在 Node.js (>=20) 中直接调用：

```ts
import {
  createDotosMcpServer,
  executeListDotosComponents,
  executeGetComponentApiAndExample,
  executeValidateSchema,
} from '@dotos1/mcp';

// 1. 创建标准 McpServer 实例并挂载自定义传输层
const server = createDotosMcpServer();

// 2. 或在工具链中直接调用纯函数校验引擎
const check = executeValidateSchema('xdraw-canvas', {
  layout: 'dagre',
  nodes: [{ id: 'plc-1', x: 100, y: 120 }],
  edges: [{ source: 'plc-1', target: 'unknown-node' }],
});

if (!check.valid) {
  console.error(check.summary, check.findings);
}
```

---

## 本地构建与端到端测试

```bash
npm run build   # TypeScript 6.0.3 strict 模式编译并赋权 dist/cli.js (0755)
npm test        # 编译并真实拉起 node dist/cli.js 子进程执行全套 MCP Stdio E2E 断言测试
```
