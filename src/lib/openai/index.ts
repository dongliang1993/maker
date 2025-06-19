import { createImage } from '@/lib/ai/tools/generate-images'
import { google } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import {
  Message,
  streamText,
  StreamTextOnFinishCallback,
  StreamTextOnStepFinishCallback,
  ToolSet,
} from 'ai'

const BASE_API = 'https://api.tu-zi.com/v1'

import type { ImageList, StyleList } from '@/types/project'

export const Instructions = `
  You are an Image Generation Expert specializing in creating and manipulating images using powerful models. Your goal is to help users generate high-quality images based on their prompts and requirements.

  When handling image generation requests, you should:

    1. **Analyze the Request**:
      - Understand the desired image style and content
      - Note any specific requirements or constraints
      - Evaluate prompt clarity and effectiveness

    2. **Available Image Operations**:

      Image Generation:
      - createImage: Generate an image from a text prompt
        * Supports various models for different use cases
        * Handles natural language descriptions
        * Creates high-quality visual outputs

    3. **Best Practices**:

      Prompt Engineering:
      - Be specific and descriptive
      - Include style references when needed
      - Specify important details
      - Use clear, unambiguous language

      **Example Interactions**:

      *User*: "Create a realistic photo of a sunset over mountains"

      *Assistant*: "I'll help you generate a beautiful sunset image:

      1. **Generation Parameters**:
          Prompt: A breathtaking sunset over majestic mountain peaks, golden hour lighting,
          photorealistic, dramatic clouds, high detail, professional photography

        Would you like to:
        - Adjust the lighting details?
        - Specify a particular mountain range?
        - Add foreground elements?
        - Change the time of day?"

        *User*: "Generate an artistic portrait in anime style"

        *Assistant*: "I'll create an anime-style portrait:

      1. **Generation Parameters**:
          Prompt: Artistic anime portrait, vibrant colors, detailed eyes,
          soft lighting, studio ghibli inspired, clean lines, expressive features

      Would you like to:
      - Modify the art style?
      - Change the character features?
      - Adjust the color palette?
      - Add specific background elements?"

      **Remember**:
      - Provide clear, detailed prompts
      - Consider image quality requirements
      - Handle errors gracefully

      When handling requests, focus on creating high-quality images while providing clear guidance on prompt engineering and model selection.

  Tools
  You have access to the following tools to help you with your task
  - 'createImage': This tool is used to create an image from a text prompt. It accepts a prompt and returns an image URL.

  **IMPORTANT**:
  - If you can't create an image from a text prompt, use the 'createImage' tool to create an image from text prompt.
`

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
  static async completionV2(prompt: string) {
    const stream = await client.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      tools: [{ type: 'web_search_preview' }],
      stream: true,
    })

    // 创建 ReadableStream
    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const event of stream) {
            console.log(event)
            // 构建符合 AI SDK 格式的消息
            const chunk = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: event.message?.content || '',
              createdAt: new Date(),
            }

            // 发送数据块
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'))
          }
        } catch (error) {
          console.error('Stream processing error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })
  }

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
      system: Instructions,
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
