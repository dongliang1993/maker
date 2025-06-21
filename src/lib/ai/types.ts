import { ToolResult as ToolResultFromAI } from 'ai'

export type ToolResult = ToolResultFromAI<
  'createImage',
  Record<string, any>,
  Record<string, any>
>
