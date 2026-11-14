/**
 * @fileoverview DOTOS Angular 22 组件库 MCP Server 实例工厂与三大核心工具注册逻辑
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  executeGetComponentApiAndExample,
  executeListDotosComponents,
} from './catalog.js';
import {
  DOTOS_JSON_SCHEMAS,
  VALID_SCHEMA_TARGETS,
  executeValidateSchema,
} from './validator.js';

/**
 * MCP Server 默认元信息常量
 */
export const DOTOS_MCP_SERVER_NAME = '@dotos1/mcp';
export const DOTOS_MCP_SERVER_VERSION = '8.0.0-next.1';

/**
 * 创建 DOTOS MCP Server 的可选参数
 */
export interface DotosMcpServerOptions {
  /** 自定义服务标识名（默认 '@dotos1/mcp'） */
  readonly name?: string;
  /** 自定义服务版本号（默认 '8.0.0-next.1'） */
  readonly version?: string;
}

/**
 * 将强类型输出对象安全序列化为 MCP Tool 标准文本与结构化负载（100% 零 any）
 */
function toStructuredRecord<T extends object>(payload: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    result[key] = value;
  }
  return result;
}

/**
 * 创建并注册好全部三大标准组件库自愈工具的 McpServer 实例
 * 支持在业务测试或自定义传输层中编程式调用，也供 CLI Stdio 入口直接复用
 */
export function createDotosMcpServer(options: DotosMcpServerOptions = {}): McpServer {
  const server = new McpServer(
    {
      name: options.name ?? DOTOS_MCP_SERVER_NAME,
      version: options.version ?? DOTOS_MCP_SERVER_VERSION,
    },
    {
      instructions:
        'DOTOS Angular 22 组件库（@dotos/dui、@dotos/duix、@dotos/xdraw）官方自愈 MCP Server。' +
        '生成前端代码前请先通过 list_dotos_components 选型，通过 get_component_api_and_example 获取零 any Signal API 与单文件黄金示例，' +
        '涉及复杂 Schema 配置时必须调用 validate_schema 完成闭环自愈校验。',
    }
  );

  // 注册内置五大复杂控件 Draft 2020-12 JSON Schema 静态资源，供客户端按需读取
  for (const target of VALID_SCHEMA_TARGETS) {
    const schemaDoc = DOTOS_JSON_SCHEMAS[target];
    const resourceUri = `dotos://schemas/${target}.schema.json`;
    server.registerResource(
      `${target}-json-schema`,
      resourceUri,
      {
        title: `${schemaDoc.title ?? target} (Draft 2020-12)`,
        description: schemaDoc.description ?? `${target} JSON Schema 定义`,
        mimeType: 'application/schema+json',
      },
      (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/schema+json',
            text: JSON.stringify(schemaDoc, null, 2),
          },
        ],
      })
    );
  }

  // 工具 1：list_dotos_components —— 组件库结构化目录与选型决策矩阵
  server.registerTool(
    'list_dotos_components',
    {
      title: '列出 DOTOS Angular 22 组件目录与选型决策表',
      description:
        '查询 @dotos/dui（MIT 开源基础包）、@dotos/duix（企业级高密度数据与 BI Pro 包）、' +
        '@dotos/xdraw（2D 工业组态拓扑画布包）的全部 Standalone Signal 组件目录、导入入口、Zoneless 兼容性与选型决策矩阵。',
      inputSchema: {
        package: z
          .enum(['all', '@dotos/dui', '@dotos/duix', '@dotos/xdraw'])
          .optional()
          .describe("按包名过滤：'all' | '@dotos/dui' | '@dotos/duix' | '@dotos/xdraw'"),
        category: z
          .enum([
            'form',
            'data-grid',
            'bi-analytics',
            'gantt-schedule',
            'layout-dock',
            'navigation-tree',
            'diagram-2d',
            'feedback',
          ])
          .optional()
          .describe('按业务与交互职责分类过滤'),
        zonelessOnly: z
          .boolean()
          .optional()
          .describe('是否仅返回 100% 兼容 Angular 22 Zoneless 模式的组件'),
        query: z
          .string()
          .optional()
          .describe('按选择器、类名、业务场景关键词模糊检索'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    (args) => {
      const output = executeListDotosComponents({
        package: args.package,
        category: args.category,
        zonelessOnly: args.zonelessOnly,
        query: args.query,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: toStructuredRecord(output),
      };
    }
  );

  // 工具 2：get_component_api_and_example —— 组件零 any Signal 契约、Headless API、反模式禁令与黄金源码示例
  server.registerTool(
    'get_component_api_and_example',
    {
      title: '获取 DOTOS 组件完整 Signal API 契约与黄金代码示例',
      description:
        '根据组件选择器（如 duix-standalone-grid / duix-grid / dui-form / xdraw-canvas）或类名（如 DuixGridStandaloneComponent）智能归一化解析，' +
        '返回标准导入路径、零 any Signal 输入输出契约、Headless Command API 签名、M3/DOTOS CSS 变量钩子、反模式禁令及最小可独立编译的单文件黄金 TS 示例。',
      inputSchema: {
        component: z
          .string()
          .min(1, 'component 参数不能为空')
          .describe(
            "目标组件选择器、短别名或类名，如 'duix-standalone-grid'、'duix-grid'、'dui-form'、'xdraw-canvas' 或 'DuixGridStandaloneComponent'"
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    (args) => {
      const output = executeGetComponentApiAndExample(args.component);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: toStructuredRecord(output),
      };
    }
  );

  // 工具 3：validate_schema —— 复杂组件 Schema 闭环自愈校验器（复刻 dotos.customizer 体验）
  server.registerTool(
    'validate_schema',
    {
      title: '校验 DOTOS 复杂组件 JSON Schema 配置并输出自愈修复建议',
      description:
        '内置 dui-form、duix-grid、duix-pivot-grid、duix-gantt、xdraw-canvas 五大复杂控件的 Draft 2020-12 JSON Schema 与深度语义校验器。' +
        '可精准捕获字段类型幻觉、重复主键、非法 px 宽度字符串、时序倒置、悬空任务依赖、悬空拓扑连线等高频 AI 幻觉，并返回可直接执行的 hint 修复指令。',
      inputSchema: {
        target: z
          .enum(['dui-form', 'duix-grid', 'duix-pivot-grid', 'duix-gantt', 'xdraw-canvas'])
          .describe('待校验的目标控件标识'),
        config: z
          .union([z.string(), z.record(z.string(), z.unknown())])
          .describe('待校验的组件配置对象或 JSON 字符串'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    (args) => {
      const output = executeValidateSchema(args.target, args.config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: toStructuredRecord(output),
      };
    }
  );

  return server;
}
