import { SYSTEM_INSTRUCTION } from '@/lib/ai/prompts'
import { createImage } from '@/lib/ai/tools/generate-images'
import { transformImage } from '@/lib/ai/tools/transform-images'
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
    userId,
  }: {
    messages: Message[]
    styleList: StyleList
    imageList: ImageList
    onError?: ({ error }: { error: unknown }) => void
    onFinish?: StreamTextOnFinishCallback<ToolSet>
    onStepFinish?: StreamTextOnStepFinishCallback<ToolSet>
    userId: string
  }) {
    const result = await streamText({
      model: google('gemini-2.0-flash'),
      temperature: 0.5,
      system: SYSTEM_INSTRUCTION,
      messages,
      tools: {
        createImage: createImage({ userId, imageList, styleList }),
        transformImage: transformImage({ userId, imageList, styleList }),
      },
      toolChoice: 'auto',
      maxSteps: 5,
      topP: 1,
      onError,
      onFinish,
      toolCallStreaming: true,
      onStepFinish: (step) => {
        console.log('step', step)
      },
    })

    return result
  }
}
