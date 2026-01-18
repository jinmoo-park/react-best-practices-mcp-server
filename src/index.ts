#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { RuleLoader, RuleIndex } from './rules.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, '..', '..');

class ReactBestPracticesServer {
  private server: Server;
  private ruleLoader: RuleLoader;
  private ruleIndex: RuleIndex | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'react-best-practices',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.ruleLoader = new RuleLoader(BASE_DIR);
    this.setupHandlers();
  }

  private async ensureRuleIndex(): Promise<RuleIndex> {
    if (!this.ruleIndex) {
      this.ruleIndex = await this.ruleLoader.loadRules();
    }
    return this.ruleIndex;
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_rules',
            description: 'List all React/Next.js best practice rules. Can filter by category, impact level, or tags.',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Filter by category (async, bundle, server, client, rerender, rendering, js, advanced)',
                  enum: ['async', 'bundle', 'server', 'client', 'rerender', 'rendering', 'js', 'advanced'],
                },
                impact: {
                  type: 'string',
                  description: 'Filter by impact level',
                  enum: ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW-MEDIUM', 'LOW'],
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Filter by tags (e.g., ["async", "performance"])',
                },
              },
            },
          },
          {
            name: 'get_rule',
            description: 'Get detailed information about a specific rule by ID or filename.',
            inputSchema: {
              type: 'object',
              properties: {
                ruleId: {
                  type: 'string',
                  description: 'Rule ID (filename without .md extension, e.g., "async-parallel")',
                },
              },
              required: ['ruleId'],
            },
          },
          {
            name: 'search_rules',
            description: 'Search rules by keyword. Searches in titles, content, tags, and categories.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results (default: 10)',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'list_categories',
            description: 'List all rule categories with their impact levels and descriptions.',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_metadata',
            description: 'Get metadata about the React Best Practices guide.',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const ruleIndex = await this.ensureRuleIndex();

        switch (name) {
          case 'list_rules': {
            const category = args?.category as string | undefined;
            const impact = args?.impact as string | undefined;
            const tags = args?.tags as string[] | undefined;

            let rules = ruleIndex.rules;

            if (category || impact || tags) {
              rules = this.ruleLoader.filterRules(ruleIndex, {
                category,
                impact,
                tags,
              });
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      count: rules.length,
                      rules: rules.map((rule) => ({
                        id: rule.id,
                        title: rule.title,
                        category: rule.category,
                        impact: rule.impact,
                        impactDescription: rule.impactDescription,
                        tags: rule.tags,
                      })),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'get_rule': {
            const ruleId = args?.ruleId as string;
            if (!ruleId) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'ruleId is required'
              );
            }

            const rule = ruleIndex.rules.find((r) => r.id === ruleId);
            if (!rule) {
              throw new McpError(
                ErrorCode.InvalidParams,
                `Rule not found: ${ruleId}`
              );
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(rule, null, 2),
                },
              ],
            };
          }

          case 'search_rules': {
            const query = args?.query as string;
            const limit = (args?.limit as number) || 10;

            if (!query) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'query is required'
              );
            }

            const results = this.ruleLoader.searchRules(query, ruleIndex);
            const limitedResults = results.slice(0, limit);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      query,
                      count: results.length,
                      results: limitedResults.map((rule) => ({
                        id: rule.id,
                        title: rule.title,
                        category: rule.category,
                        impact: rule.impact,
                        tags: rule.tags,
                        excerpt: rule.content.substring(0, 200) + '...',
                      })),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'list_categories': {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      categories: ruleIndex.sections.map((section) => ({
                        id: section.id,
                        name: section.name,
                        prefix: section.prefix,
                        impact: section.impact,
                        description: section.description,
                        ruleCount: ruleIndex.rules.filter(
                          (r) => r.categoryId === section.id
                        ).length,
                      })),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          case 'get_metadata': {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(ruleIndex.metadata, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('React Best Practices MCP server running on stdio');
  }
}

const server = new ReactBestPracticesServer();
server.run().catch(console.error);
