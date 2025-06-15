import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getDatabase } from '@/database'
import { OpenAI } from '@/lib/openai'

import type { Content } from '@/database/types'
import type { Message } from 'ai'

const messageSchema = z.object({
  projectId: z.string(),
  text: z.string(),
  imageList: z
    .array(
      z.object({
        imageUrl: z.string(),
      })
    )
    .optional(),
  styleList: z
    .array(
      z.object({
        styleName: z.string(),
        styleCoverUrl: z.string(),
        imagePrompt: z.string(),
      })
    )
    .optional(),
})

const getChatHistorySchema = z.object({
  projectId: z.string(),
})

const convertMessageToUIMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content,
  }
}

/**
 * 获取 project 中的 chat history 列表
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    const {
      success,
      data: params,
      error: parseError,
    } = getChatHistorySchema.safeParse({
      projectId: searchParams.get('projectId'),
    })

    if (!success) {
      console.error('[chat history] 获取消息失败:', parseError)
      return NextResponse.json({ error: '缺少项目ID' }, { status: 400 })
    }

    const db = getDatabase('server')
    const { data, error, message } = await db.chatHistory.findByProject(
      params.projectId
    )

    if (error) {
      console.error('[chat history] 获取消息失败:', error)
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error('[chat history] 获取消息失败:', error)
    return NextResponse.json(
      {
        error: '获取消息失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

// 创建新消息
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { data, messages } = await request.json()

    const { text, projectId, imageList, styleList } = messageSchema.parse(
      JSON.parse(data)
    )

    const db = getDatabase('server')

    const saveMessage = async ({
      text,
      role,
      content,
      name,
    }: {
      text?: string
      role: 'user' | 'assistant'
      content?: Content[]
      name?: string
    }) => {
      await db.chatHistory.create({
        user_id: userId,
        project_id: projectId,
        text: text ?? '',
        content: content ?? [],
        role,
        name,
      })
    }

    await saveMessage({
      text,
      role: 'user',
    })

    // 获取用户意图
    const userIntent = await OpenAI.tryGetUserIntent(text)

    switch (userIntent) {
      case 'generation':
        const { images } = await OpenAI.generateImage({
          prompt: text,
          imageList: imageList ?? [],
          styleList: styleList ?? [],
        })

        // 保存助手消息
        const assistantMessage = {
          role: 'assistant' as const,
          name: 'gpt-image-1',
          content: [
            {
              eventType: 'image_generation',
              eventData: {
                eventType: 'image_generation',
                artifact: images,
              },
            },
          ],
        }

        await saveMessage(assistantMessage)

        // 返回流式响应
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(JSON.stringify(assistantMessage)))
            controller.close()
          },
        })

        return new Response(stream)
      case 'edit':
        break
      case 'other':
        const result = await OpenAI.completions({
          messages: messages.map(convertMessageToUIMessage),
          onStepFinish: (response) => {
            const text = response?.text
            if (text) {
              saveMessage({
                text,
                role: 'assistant',
              })
            }
          },
        })

        return result.toDataStreamResponse()
    }
  } catch (error) {
    console.error('处理消息失败:', error)
    return NextResponse.json({ error: '处理消息失败' }, { status: 500 })
  }
}
