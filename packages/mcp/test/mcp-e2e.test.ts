/**
 * @fileoverview @dotos1/mcp 真实子进程 Stdio 端到端测试与编程式接口全量覆盖单测（100% 零 any）
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import {
  DOTOS_MCP_SERVER_NAME,
  DOTOS_MCP_SERVER_VERSION,
  createDotosMcpServer,
  type ComponentApiNotFoundOutput,
  type ComponentApiSuccessOutput,
  type GetComponentApiOutput,
  type ListComponentsOutput,
  type ValidateSchemaOutput,
} from '../src/index.js';

/**
 * 项目根目录与编译产物路径
 */
const PACKAGE_ROOT = path.resolve('/tmp/ng22-mcp');
const CLI_DIST_PATH = path.join(PACKAGE_ROOT, 'dist', 'cli.js');

/**
 * 从 client.callTool 返回值中提取首个文本块并反序列化为 JSON（零 any 类型窄化辅助）
 */
function parseToolTextJson<T>(toolResult: Awaited<ReturnType<Client['callTool']>>): T {
  assert.ok('content' in toolResult && Array.isArray(toolResult.content), '预期返回包含 content 数组');
  const firstItem = toolResult.content[0];
  assert.ok(firstItem !== undefined && firstItem.type === 'text', '预期首个内容块为 text 类型');
  return JSON.parse(firstItem.text) as T;
}

describe('@dotos1/mcp 组件库自愈 MCP Server 端到端集成测试套件', () => {
  let client: Client;
  let transport: StdioClientTransport;

  before(async () => {
    // 1. 校验编译产物 dist/cli.js 存在且具备可执行权限 (0o755)
    const stat = fs.statSync(CLI_DIST_PATH);
    assert.ok((stat.mode & 0o111) !== 0, 'dist/cli.js 必须具备可执行权限');

    const firstLine = fs.readFileSync(CLI_DIST_PATH, 'utf8').split('\n')[0];
    assert.equal(firstLine, '#!/usr/bin/env node', 'dist/cli.js 首行必须包含 node shebang');

    // 2. 通过真实子进程 node dist/cli.js 建立标准 MCP Stdio 通道
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [CLI_DIST_PATH],
      cwd: PACKAGE_ROOT,
      stderr: 'pipe',
    });

    client = new Client(
      {
        name: 'dotos-mcp-e2e-tester',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);
  });

  after(async () => {
    await client.close();
  });

  it('支持编程式 createDotosMcpServer() 实例化与 CLI --version / --help 直接执行', () => {
    const serverInstance = createDotosMcpServer();
    assert.ok(serverInstance !== undefined, '编程式创建 McpServer 实例成功');
    assert.equal(serverInstance.isConnected(), false, '未连接传输层前应处于未连接态');

    const versionStdout = execFileSync(CLI_DIST_PATH, ['--version'], {
      cwd: PACKAGE_ROOT,
      encoding: 'utf8',
    }).trim();
    assert.equal(versionStdout, `${DOTOS_MCP_SERVER_NAME}@${DOTOS_MCP_SERVER_VERSION}`);

    const helpStdout = execFileSync(CLI_DIST_PATH, ['--help'], {
      cwd: PACKAGE_ROOT,
      encoding: 'utf8',
    });
    assert.ok(helpStdout.includes('list_dotos_components'));
    assert.ok(helpStdout.includes('get_component_api_and_example'));
    assert.ok(helpStdout.includes('validate_schema'));
  });

  it('Stdio 协议握手：client.listTools() 暴露三大核心工具且 client.listResources() 暴露五大 Draft 2020-12 Schema', async () => {
    const toolsRes = await client.listTools();
    const toolNames = toolsRes.tools.map((t) => t.name).sort();
    assert.deepEqual(toolNames, [
      'get_component_api_and_example',
      'list_dotos_components',
      'validate_schema',
    ]);

    const resourcesRes = await client.listResources();
    assert.equal(resourcesRes.resources.length, 5, '应暴露五大复杂控件的 Draft 2020-12 JSON Schema 资源');

    const readFormSchema = await client.readResource({
      uri: 'dotos://schemas/dui-form.schema.json',
    });
    const firstContent = readFormSchema.contents[0];
    assert.ok(firstContent !== undefined && 'text' in firstContent);
    const schemaJson = JSON.parse(firstContent.text) as { readonly $schema?: string };
    assert.equal(schemaJson.$schema, 'https://json-schema.org/draft/2020-12/schema');
  });

  it('工具 1 (list_dotos_components)：全量查询覆盖三大包 10 个核心 Standalone Signal 组件及选型矩阵，且多维过滤精准生效', async () => {
    // 1. 全量查询
    const allRes = await client.callTool({
      name: 'list_dotos_components',
      arguments: {},
    });
    const allPayload = parseToolTextJson<ListComponentsOutput>(allRes);
    assert.equal(allPayload.totalCount, 10, '三大包共计 10 个核心 Standalone Signal 组件');
    assert.ok(allPayload.decisionMatrix.length >= 8, '选型决策矩阵覆盖全部核心业务场景');

    const tags = allPayload.components.map((c) => c.tag);
    for (const expectedTag of [
      '<dui-standalone-button>',
      '<dui-standalone-card>',
      '<dui-standalone-tabs>',
      '<dui-standalone-split-dock>',
      '<dui-standalone-tree>',
      '<dui-standalone-form>',
      '<duix-standalone-grid>',
      '<duix-standalone-pivot-grid>',
      '<duix-standalone-gantt>',
      '<xdraw-standalone-canvas>',
    ]) {
      assert.ok(tags.includes(expectedTag), `组件目录必须包含 ${expectedTag}`);
    }
    assert.ok(
      allPayload.components.every((c) => c.zonelessCompatible),
      '全部组件必须标记为 100% Zoneless 兼容'
    );

    // 2. 按 @dotos/duix 包过滤
    const duixRes = await client.callTool({
      name: 'list_dotos_components',
      arguments: {
        package: '@dotos/duix',
        zonelessOnly: true,
      },
    });
    const duixPayload = parseToolTextJson<ListComponentsOutput>(duixRes);
    assert.equal(duixPayload.totalCount, 3);
    assert.ok(duixPayload.components.every((c) => c.importEntry === '@dotos/duix/standalone'));

    // 3. 按分类与关键词组合检索 @dotos/xdraw
    const xdrawRes = await client.callTool({
      name: 'list_dotos_components',
      arguments: {
        category: 'diagram-2d',
        query: 'SCADA',
      },
    });
    const xdrawPayload = parseToolTextJson<ListComponentsOutput>(xdrawRes);
    assert.equal(xdrawPayload.totalCount, 1);
    assert.equal(xdrawPayload.components[0]?.selector, 'xdraw-standalone-canvas');
  });

  it('工具 2 (get_component_api_and_example)：支持选择器/短名/类名智能归一化，返回完整 Signal API、Headless API、禁令与零 any 黄金示例', async () => {
    // 1. 测试网格别名归一化 ('duix-grid' 與 'DuixGridStandaloneComponent' 等价解析)
    for (const alias of ['duix-standalone-grid', 'duix-grid', 'DuixGridStandaloneComponent']) {
      const res = await client.callTool({
        name: 'get_component_api_and_example',
        arguments: { component: alias },
      });
      const payload = parseToolTextJson<GetComponentApiOutput>(res);
      assert.equal(payload.found, true, `别名 ${alias} 应成功归一化解析`);
      const hit = payload as ComponentApiSuccessOutput;
      assert.equal(hit.resolvedSelector, 'duix-standalone-grid');
      assert.equal(hit.imports.standaloneImportPath, '@dotos/duix/standalone');
      assert.equal(hit.imports.schemaImportPath, '@dotos/duix/schema');

      const commandMethods = hit.headlessCommandApi.map((cmd) => cmd.method);
      for (const requiredMethod of ['applyFilter', 'applySort', 'clearFilters', 'exportCsv']) {
        assert.ok(commandMethods.includes(requiredMethod), `网格必须暴露 Headless 方法 ${requiredMethod}`);
      }

      assert.ok(hit.cssTokenHooks.some((t) => t.token.startsWith('--mat-sys-')));
      assert.ok(hit.cssTokenHooks.some((t) => t.token.startsWith('--dui-')));
      assert.ok(hit.antiPatternBans.length >= 5, '必须包含完整的 Zoneless/Standalone 反模式禁令');
      assert.ok(hit.goldenStandaloneExample.includes('ChangeDetectionStrategy.OnPush'));
      assert.ok(hit.goldenStandaloneExample.includes('standalone: true'));
      assert.ok(!hit.goldenStandaloneExample.includes('NgModule'));
      assert.ok(!hit.goldenStandaloneExample.includes('::ng-deep'));
      assert.ok(!/\bany\b/.test(hit.goldenStandaloneExample), '黄金示例源码严禁包含 any');
    }

    // 2. 校验甘特图 Headless Command API
    const ganttRes = await client.callTool({
      name: 'get_component_api_and_example',
      arguments: { component: 'duix-gantt' },
    });
    const ganttHit = parseToolTextJson<ComponentApiSuccessOutput>(ganttRes);
    assert.equal(ganttHit.found, true);
    const ganttMethods = ganttHit.headlessCommandApi.map((m) => m.method);
    for (const method of ['scrollToTask', 'setZoomLevel', 'exportSchedule']) {
      assert.ok(ganttMethods.includes(method), `甘特图必须暴露 Headless 方法 ${method}`);
    }

    // 3. 校验 xdraw 画布 Headless Command API
    const canvasRes = await client.callTool({
      name: 'get_component_api_and_example',
      arguments: { component: '<xdraw-canvas>' },
    });
    const canvasHit = parseToolTextJson<ComponentApiSuccessOutput>(canvasRes);
    assert.equal(canvasHit.found, true);
    const canvasMethods = canvasHit.headlessCommandApi.map((m) => m.method);
    for (const method of ['highlightNodes', 'autoLayout', 'exportSvg', 'fitView']) {
      assert.ok(canvasMethods.includes(method), `xdraw 画布必须暴露 Headless 方法 ${method}`);
    }

    // 4. 遍历全部 10 个官方组件验证均能解析且黄金示例 100% 合规（零 any、OnPush、Standalone）
    for (const selector of [
      'dui-standalone-button',
      'dui-standalone-card',
      'dui-standalone-tabs',
      'dui-standalone-split-dock',
      'dui-standalone-tree',
      'dui-standalone-form',
      'duix-standalone-grid',
      'duix-standalone-pivot-grid',
      'duix-standalone-gantt',
      'xdraw-standalone-canvas',
    ]) {
      const compRes = await client.callTool({
        name: 'get_component_api_and_example',
        arguments: { component: selector },
      });
      const compOut = parseToolTextJson<ComponentApiSuccessOutput>(compRes);
      assert.equal(compOut.found, true, `${selector} 必须成功命中`);
      assert.ok(compOut.signalContracts.length >= 3, `${selector} 必须声明完整 Signal 端口契约`);
      assert.ok(compOut.headlessCommandApi.length >= 2, `${selector} 必须声明 Headless Command API`);
      assert.ok(compOut.goldenStandaloneExample.includes('ChangeDetectionStrategy.OnPush'));
      assert.ok(compOut.goldenStandaloneExample.includes('standalone: true'));
      assert.ok(!/\bany\b/.test(compOut.goldenStandaloneExample), `${selector} 黄金示例严禁含 any`);
    }

    // 5. 校验未知组件友好错误与最相近候选建议 hint
    const unknownRes = await client.callTool({
      name: 'get_component_api_and_example',
      arguments: { component: 'duix-enterprise-datagrid' },
    });
    const notFound = parseToolTextJson<ComponentApiNotFoundOutput>(unknownRes);
    assert.equal(notFound.found, false);
    assert.ok(notFound.error.includes('duix-enterprise-datagrid'));
    assert.ok(notFound.hint.includes('duix-standalone-grid'), 'hint 应精准推荐最接近的网格组件');
    assert.ok(notFound.candidates.length > 0);
  });

  it('工具 3 (validate_schema) [1/5] dui-form：合法配置通过 + 字段类型幻觉/重复 key/缺失 options/min>max 自愈断言', async () => {
    // 合法配置（JSON 字符串形式传入验证双格式兼容）
    const validRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'dui-form',
        config: JSON.stringify({
          layout: 'horizontal',
          columns: 2,
          fields: [
            { key: 'code', label: '编码', type: 'text', required: true },
            {
              key: 'category',
              label: '类别',
              type: 'select',
              options: [{ label: '传感器', value: 'sensor' }],
            },
            { key: 'threshold', label: '阈值', type: 'number', min: 0, max: 100 },
          ],
        }),
      },
    });
    const validOut = parseToolTextJson<ValidateSchemaOutput>(validRes);
    assert.equal(validOut.valid, true);
    assert.equal(validOut.findings.length, 0);

    // 幻觉配置 A：缺失 fields
    const missingFieldsRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'dui-form',
        config: { columns: 2 },
      },
    });
    const missingFieldsOut = parseToolTextJson<ValidateSchemaOutput>(missingFieldsRes);
    assert.equal(missingFieldsOut.valid, false);
    assert.equal(missingFieldsOut.findings[0]?.code, 'MISSING_FORM_FIELDS');
    assert.ok(missingFieldsOut.findings[0]?.hint.includes('fields'));

    // 幻觉配置 B：重复 key、textfield/dropdown 幻觉枚举、select 缺 options、min > max
    const badRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'dui-form',
        config: {
          fields: [
            { key: 'userName', label: '用户名', type: 'textfield' },
            { key: 'userName', label: '重复用户名', type: 'dropdown' },
            { key: 'role', label: '角色', type: 'select' },
            { key: 'age', label: '年龄', type: 'number', min: 120, max: 18 },
          ],
        },
      },
    });
    const badOut = parseToolTextJson<ValidateSchemaOutput>(badRes);
    assert.equal(badOut.valid, false);
    const codes = badOut.findings.map((f) => f.code);
    assert.ok(codes.includes('INVALID_FIELD_TYPE'));
    assert.ok(codes.includes('DUPLICATE_FIELD_KEY'));
    assert.ok(codes.includes('MISSING_SELECT_OPTIONS'));
    assert.ok(codes.includes('MIN_GREATER_THAN_MAX'));

    const textFieldFinding = badOut.findings.find((f) => f.path === '$.fields[0].type');
    assert.ok(textFieldFinding?.hint.includes("'text'"), 'textfield 幻觉应提示改为 text');

    const dropdownFinding = badOut.findings.find((f) => f.path === '$.fields[1].type');
    assert.ok(dropdownFinding?.hint.includes("'select'"), 'dropdown 幻觉应提示改为 select');
  });

  it('工具 3 (validate_schema) [2/5] duix-grid：合法配置通过 + 列缺失/重复 field/px 字符串宽度/虚拟滚动缺 rowKey 警告断言', async () => {
    const validRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-grid',
        config: {
          rowKey: 'id',
          virtualScroll: true,
          columns: [
            { field: 'id', header: '主键', width: 120, pinned: 'left' },
            { field: 'ratio', header: '占比', width: '40%', sortable: true },
          ],
        },
      },
    });
    const validOut = parseToolTextJson<ValidateSchemaOutput>(validRes);
    assert.equal(validOut.valid, true);
    assert.equal(validOut.findings.length, 0);

    // 幻觉配置 A：缺失 columns（误写为 columnDefs）
    const missingColsRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-grid',
        config: { columnDefs: [] },
      },
    });
    const missingColsOut = parseToolTextJson<ValidateSchemaOutput>(missingColsRes);
    assert.equal(missingColsOut.valid, false);
    assert.equal(missingColsOut.findings[0]?.code, 'MISSING_GRID_COLUMNS');
    assert.ok(missingColsOut.findings[0]?.hint.includes('columns'));

    // 幻觉配置 B：用 dataIndex/title 替代 field/header、重复列 field、width 写成 '160px'、开虚拟滚动未配 rowKey
    const badRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-grid',
        config: {
          virtualScroll: true,
          columns: [
            { dataIndex: 'code', title: '编号', width: '160px' },
            { field: 'status', header: '状态', width: 100 },
            { field: 'status', header: '状态副本', width: 100 },
          ],
        },
      },
    });
    const badOut = parseToolTextJson<ValidateSchemaOutput>(badRes);
    assert.equal(badOut.valid, false);
    const codes = badOut.findings.map((f) => f.code);
    assert.ok(codes.includes('MISSING_COLUMN_FIELD'));
    assert.ok(codes.includes('MISSING_COLUMN_HEADER'));
    assert.ok(codes.includes('COLUMN_WIDTH_PX_STRING_HALLUCINATION'));
    assert.ok(codes.includes('DUPLICATE_COLUMN_FIELD'));
    assert.ok(codes.includes('VIRTUAL_SCROLL_MISSING_ROW_KEY'));

    const widthFinding = badOut.findings.find((f) => f.code === 'COLUMN_WIDTH_PX_STRING_HALLUCINATION');
    assert.ok(widthFinding?.hint.includes('160'), 'px 宽度幻觉应直接给出纯数字修复值 160');

    const rowKeyWarn = badOut.findings.find((f) => f.code === 'VIRTUAL_SCROLL_MISSING_ROW_KEY');
    assert.equal(rowKeyWarn?.severity, 'warning');
    assert.ok(rowKeyWarn?.hint.includes('rowKey'));
  });

  it('工具 3 (validate_schema) [3/5] duix-pivot-grid：合法配置通过 + 缺失维度与非法聚合函数枚举自愈断言', async () => {
    const validRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-pivot-grid',
        config: {
          rows: [{ field: 'plant', label: '工厂' }],
          columns: [{ field: 'month', label: '月份' }],
          measures: [
            { field: 'yieldQty', label: '产量', aggregator: 'sum' },
            { field: 'oee', label: '综合效率', aggregator: 'avg' },
          ],
        },
      },
    });
    const validOut = parseToolTextJson<ValidateSchemaOutput>(validRes);
    assert.equal(validOut.valid, true);
    assert.equal(validOut.findings.length, 0);

    const badRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-pivot-grid',
        config: {
          columns: [{ field: 'month' }],
          measures: [{ field: 'oee', aggregator: 'average' }],
        },
      },
    });
    const badOut = parseToolTextJson<ValidateSchemaOutput>(badRes);
    assert.equal(badOut.valid, false);
    const codes = badOut.findings.map((f) => f.code);
    assert.ok(codes.includes('MISSING_PIVOT_ROWS'));
    assert.ok(codes.includes('INVALID_MEASURE_AGGREGATOR'));

    const aggFinding = badOut.findings.find((f) => f.code === 'INVALID_MEASURE_AGGREGATOR');
    assert.ok(aggFinding?.hint.includes("'avg'"));
    assert.ok(aggFinding?.hint.includes("'sum' | 'avg' | 'count' | 'min' | 'max'"));
  });

  it('工具 3 (validate_schema) [4/5] duix-gantt：合法配置通过 + 时序倒置/进度越界/悬空前置任务依赖自愈断言', async () => {
    const validRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-gantt',
        config: {
          viewMode: 'week',
          tasks: [
            { id: 'T-1', name: '备料', startDate: '2026-11-01', endDate: '2026-11-03', progress: 100 },
            {
              id: 'T-2',
              name: '精加工',
              startDate: '2026-11-04',
              endDate: '2026-11-10',
              progress: 60,
              dependencies: ['T-1'],
            },
          ],
        },
      },
    });
    const validOut = parseToolTextJson<ValidateSchemaOutput>(validRes);
    assert.equal(validOut.valid, true);
    assert.equal(validOut.findings.length, 0);

    const badRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'duix-gantt',
        config: {
          tasks: [
            {
              id: 'T-10',
              title: '误用 title 的排程任务',
              startDate: '2026-11-20',
              endDate: '2026-11-12',
              progress: 135,
              dependencies: ['GHOST-TASK-99'],
            },
          ],
        },
      },
    });
    const badOut = parseToolTextJson<ValidateSchemaOutput>(badRes);
    assert.equal(badOut.valid, false);
    const codes = badOut.findings.map((f) => f.code);
    assert.ok(codes.includes('MISSING_TASK_NAME'));
    assert.ok(codes.includes('END_DATE_BEFORE_START_DATE'));
    assert.ok(codes.includes('PROGRESS_OUT_OF_RANGE'));
    assert.ok(codes.includes('DANGLING_TASK_DEPENDENCY'));

    const depFinding = badOut.findings.find((f) => f.code === 'DANGLING_TASK_DEPENDENCY');
    assert.ok(depFinding?.hint.includes('T-10'), '悬空依赖提示应列出当前已存在的合法任务 ID');
  });

  it('工具 3 (validate_schema) [5/5] xdraw-canvas：合法配置通过 + 缺失坐标/悬空边检测/未知布局算法自愈断言', async () => {
    const validRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'xdraw-canvas',
        config: {
          layout: 'dagre',
          nodes: [
            { id: 'n-plc', label: '主站 PLC', x: 100, y: 120 },
            { id: 'n-valve', label: '调节阀', x: 360, y: 120 },
          ],
          edges: [{ id: 'e-1', source: 'n-plc', target: 'n-valve' }],
        },
      },
    });
    const validOut = parseToolTextJson<ValidateSchemaOutput>(validRes);
    assert.equal(validOut.valid, true);
    assert.equal(validOut.findings.length, 0);

    const badRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'xdraw-canvas',
        config: {
          layout: 'elk-layered',
          nodes: [
            { id: 'node-a', label: '节点A', x: 50, y: 80 },
            { id: 'node-a', label: '重复ID且用嵌套position', position: { x: 200, y: 80 } },
          ],
          edges: [
            { source: 'node-a', target: 'missing-node-z' },
          ],
        },
      },
    });
    const badOut = parseToolTextJson<ValidateSchemaOutput>(badRes);
    assert.equal(badOut.valid, false);
    const codes = badOut.findings.map((f) => f.code);
    assert.ok(codes.includes('INVALID_LAYOUT_ALGORITHM'));
    assert.ok(codes.includes('DUPLICATE_NODE_ID'));
    assert.ok(codes.includes('MISSING_NODE_COORDINATE_X'));
    assert.ok(codes.includes('MISSING_NODE_COORDINATE_Y'));
    assert.ok(codes.includes('DANGLING_EDGE_TARGET'));

    const layoutFinding = badOut.findings.find((f) => f.code === 'INVALID_LAYOUT_ALGORITHM');
    assert.ok(
      layoutFinding?.hint.includes("'dagre' | 'grid' | 'circular' | 'force'"),
      '未知布局算法必须提示四大标准算法枚举'
    );

    const danglingEdgeFinding = badOut.findings.find((f) => f.code === 'DANGLING_EDGE_TARGET');
    assert.ok(danglingEdgeFinding?.hint.includes('node-a'), '悬空边提示应列出可用节点 ID');
  });

  it('工具 3 (validate_schema) 畸形 JSON 字符串输入优雅容错并返回 INVALID_JSON_SYNTAX 自愈提示', async () => {
    const brokenJsonRes = await client.callTool({
      name: 'validate_schema',
      arguments: {
        target: 'dui-form',
        config: '{ fields: [invalid json }',
      },
    });
    const out = parseToolTextJson<ValidateSchemaOutput>(brokenJsonRes);
    assert.equal(out.valid, false);
    assert.equal(out.findings[0]?.code, 'INVALID_JSON_SYNTAX');
    assert.ok((out.findings[0]?.hint.length ?? 0) > 10);
  });
});
