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

import type { ImageList, StyleList } from '@/types/project'

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

export class OpenAI {
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
  }

  static transformMessagesToPrompt({
    userPrompt,
    imageList,
    styleList,
  }: {
    userPrompt: string
    imageList: ImageList
    styleList: StyleList
  }) {
    let finalPrompt = `Here is the user prompt: ${userPrompt}`

    if (imageList.length > 0) {
      finalPrompt += `\nAnd There is a user uploaded image: ${imageList[0]?.imageUrl}`
    }

    if (styleList.length > 0) {
      finalPrompt += `\nUser also uploaded a reference image: ${styleList[0]?.styleCoverUrl}. You can use the style of the reference image to generate the image. \nThe style is: ${styleList[0]?.imagePrompt}`
    }

    return finalPrompt
  }

  static async generateImage({
    prompt: userPrompt,
    imageList,
    styleList,
  }: {
    prompt: string
    imageList: ImageList
    styleList: StyleList
  }) {
    const prompt = this.transformMessagesToPrompt({
      userPrompt,
      imageList,
      styleList,
    })

    const response = await fetch(`${BASE_API}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer sk-p1W07xlEK1cQEmBceRf4jyJHcW35MGsRIgPOEf4V4DBnfeCj`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        response_format: 'url',
      }),
    }).then((res) => res.json())

    const images = response.data.map((item: { url: string }) => ({
      imageUrl: item.url,
      source: 'gpt-image-1',
    }))

    return {
      images,
    }
  }
}
