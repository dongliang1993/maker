import { createOpenAI } from '@ai-sdk/openai'
import {
  generateText,
  Message,
  streamText,
  StreamTextOnFinishCallback,
  StreamTextOnStepFinishCallback,
  ToolSet,
} from 'ai'
const BASE_API = 'https://api.tu-zi.com/v1'

const openai = createOpenAI({
  apiKey: 'sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj',
  baseURL: BASE_API,
  headers: {
    Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
  },
})

export type UserIntent = 'generation' | 'edit' | 'other'

export type Completion = {
  role: 'user' | 'assistant'
  content: string
}

export class GPTService {
  // 尝试获取用户意图
  // 返回值： '图片生成' | '图片编辑' | '其他'
  static async tryGetUserIntent(prompt: string) {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `你是一个意图识别专家，判断用户的输入意图。用户的输入可能很随机，有可能是想要通过文字描述'生成图片'或者'图片编辑'，也有可能是聊天。请根据用户输入的意图，返回一个意图识别结果。返回的结果 只能为'generation','edit','other'其中一个`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      maxTokens: undefined,
      temperature: 1,
    })

    return text

    // const response = await api({
    //   method: 'POST',
    //   url: `/v1/chat/completions`,
    //   data: {
    //     max_tokens: 0,
    //     prompt,
    //     model: 'gpt-4o-mini',
    //     temperature: 1,
    //     messages: [
    //       {
    //         role: 'system',
    //         content: `你是一个意图识别专家，判断用户的输入意图。用户的输入可能很随机，有可能是想要通过文字描述'生成图片'或者'图片编辑'，也有可能是聊天。请根据用户输入的意图，返回一个意图识别结果。返回的结果 只能为'generation','edit','other'其中一个`,
    //       },
    //       {
    //         role: 'user',
    //         content: prompt,
    //       },
    //     ],
    //     stream: false,
    //     group: 'default',
    //   },
    //   headers: {
    //     Authorization: `sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
    //   },
    // }).then((res) => res.data)

    // const { choices } = response
    // const { message } = choices[0]
    // const { content } = message

    // return content as UserIntent
  }

  static async completions({
    messages,
    onError,
    onFinish,
    onStepFinish,
  }: {
    messages: Message[]
    onError?: ({ error }: { error: unknown }) => void
    onFinish?: StreamTextOnFinishCallback<ToolSet>
    onStepFinish?: StreamTextOnStepFinishCallback<ToolSet>
  }) {
    const result = await streamText({
      model: openai('gpt-4o'),
      maxTokens: undefined,
      temperature: 1,
      toolChoice: 'auto',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.',
        },
        ...messages,
      ],
      onError: (error) => {
        console.error(error)
        onError?.(error)
      },
      onFinish: onFinish,
      onStepFinish: onStepFinish,
    })

    return result

    // const response = await api({
    //   method: 'POST',
    //   url: `/v1/chat/completions`,
    //   data: {
    //     prompt,
    //     max_tokens: 0,
    //     model: 'gpt-4o-mini',
    //     group: 'default',
    //     temperature: 1,
    //     messages: [
    //       {
    //         role: 'system',
    //         content:
    //           'You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.',
    //       },
    //       {
    //         role: 'user',
    //         content: prompt,
    //       },
    //     ],
    //     stream: true,
    //   },
    // }).then((res) => res.data)

    // const { choices } = response
    // return choices?.map((choice: any) => {
    //   const { message } = choice
    //   const { content, role } = message
    //   return {
    //     role,
    //     content,
    //   } as Completion
    // })
  }
}
