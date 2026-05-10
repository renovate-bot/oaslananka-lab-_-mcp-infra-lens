#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerToolsOnServer } from './server-core.js';
import { createStdioShutdownHandler } from './shutdown.js';
import { getPackageVersion } from './version.js';

function shouldPrintHelp(args: string[]): boolean {
  return args.includes('--help') || args.includes('-h');
}

function shouldPrintVersion(args: string[]): boolean {
  return args.includes('--version') || args.includes('-v');
}

function printHelp(): void {
  process.stdout.write(`mcp-infra-lens ${getPackageVersion()}

Usage:
  mcp-infra-lens            Start stdio MCP transport
  mcp-infra-lens --help     Show this help
  mcp-infra-lens --version  Show package version

HTTP transport:
  npm run start:http
`);
}

export async function createStdioServer(): Promise<McpServer> {
  const server = new McpServer(
    {
      name: 'mcp-infra-lens',
      version: getPackageVersion()
    },
    {
      capabilities: {
        logging: {}
      }
    }
  );

  registerToolsOnServer(server);
  return server;
}

if (shouldPrintHelp(process.argv.slice(2))) {
  printHelp();
  process.exit(0);
}

if (shouldPrintVersion(process.argv.slice(2))) {
  process.stdout.write(`${getPackageVersion()}\n`);
  process.exit(0);
}

const server = await createStdioServer();
const transport = new StdioServerTransport();
await server.connect(transport);

const shutdown = createStdioShutdownHandler(server);
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
