import { SYSTEM_INSTRUCTION } from '@/lib/ai/prompts'
import { createImage } from '@/lib/ai/tools/generate-images'
import { google } from '@ai-sdk/google'
import {
  Message,
  streamText,
  StreamTextOnFinishCallback,
  StreamTextOnStepFinishCallback,
  ToolSet,
} from 'ai'

import type { ImageList, StyleList } from '@/types/project'

export type Completion = {
  role: 'user' | 'assistant'
  content: string
}

export class GoogleAI {
  static async completions({
    messages,
    styleList,
    imageList,
    onError,
    onFinish,
    onStepFinish,
  }: {
    messages: Message[]
    styleList: StyleList
    imageList: ImageList
    onError?: ({ error }: { error: unknown }) => void
    onFinish?: StreamTextOnFinishCallback<ToolSet>
    onStepFinish?: StreamTextOnStepFinishCallback<ToolSet>
  }) {
    const result = await streamText({
      model: google('gemini-2.0-flash'),
      temperature: 0.5,
      system: SYSTEM_INSTRUCTION,
      messages,
      tools: {
        createImage: createImage,
      },
      toolChoice: 'auto',
      maxSteps: 5,
      topP: 1,
      onError,
      onFinish,
      onStepFinish,
    })

    return result
  }
}
