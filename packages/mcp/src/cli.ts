#!/usr/bin/env node
/**
 * @fileoverview @dotos1/mcp 标准 Stdio CLI 启动入口（支持 npx @dotos1/mcp 零配置拉起）
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  DOTOS_MCP_SERVER_NAME,
  DOTOS_MCP_SERVER_VERSION,
  createDotosMcpServer,
} from './server.js';

/**
 * 解析命令行快捷帮助与版本标志，默认启动 MCP Stdio 传输通道
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${DOTOS_MCP_SERVER_NAME}@${DOTOS_MCP_SERVER_VERSION}\n`);
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    const helpMessage = [
      `${DOTOS_MCP_SERVER_NAME}@${DOTOS_MCP_SERVER_VERSION} — DOTOS Angular 22 组件库自愈 MCP Server`,
      '',
      '用法：',
      '  npx @dotos1/mcp          以标准 MCP Stdio 传输协议启动服务',
      '  dotos-mcp --version      打印版本号',
      '  dotos-mcp --help         显示本帮助说明',
      '',
      '内置三大标准 MCP 工具：',
      '  1. list_dotos_components         查询 @dotos/dui、@dotos/duix、@dotos/xdraw 组件目录与选型矩阵',
      '  2. get_component_api_and_example 获取组件零 any Signal 契约、Headless API、禁令与单文件黄金示例',
      '  3. validate_schema               五大复杂组件 Draft 2020-12 Schema 与 AI 幻觉自愈校验器',
      '',
    ].join('\n');
    process.stdout.write(helpMessage);
    return;
  }

  const server = createDotosMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`[dotos-mcp] 启动异常: ${message}\n`);
  process.exitCode = 1;
});
