import { auth } from '@clerk/nextjs/server'
import { appendClientMessage, appendResponseMessages } from 'ai'

import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import { getDatabase } from '@/database'
import { getMessagesByChatId, saveMessages } from '@/database/queries'
import { DBMessage } from '@/database/types'
import { GoogleAI } from '@/lib/google'

import { postRequestBodySchema, type PostRequestBody } from './schema'

const getChatHistorySchema = z.object({
  projectId: z.string(),
})

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
  let requestBody: PostRequestBody

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const json = await request.json()

    requestBody = postRequestBodySchema.parse(json)

    const { message, projectId, imageList, styleList } = requestBody

    const previousMessages: DBMessage[] = await getMessagesByChatId({
      chatId: projectId,
    })

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages,
      message,
    })

    await saveMessages({
      messages: [
        {
          id: uuidv4(),
          user_id: userId,
          project_id: projectId,
          role: 'user',
          content: message.content,
          parts: message.parts,
          tool_content: [],
          image_list: imageList ?? [],
          name: '',
        },
      ],
    })

    const result = await GoogleAI.completions({
      userId,
      messages,
      styleList,
      imageList,

      onFinish: async (response) => {
        try {
          const [, assistantMessage] = appendResponseMessages({
            messages: [message],
            responseMessages: response.response.messages,
          })
          await saveMessages({
            messages: [
              {
                id: uuidv4(),
                user_id: userId,
                project_id: projectId,
                role: assistantMessage.role,
                content: assistantMessage.content,
                parts: assistantMessage.parts,
                tool_content: [],
                name: '',
              },
            ],
          })
        } catch (error) {
          console.error('[onFinish] 处理消息失败:', error)
        }
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('处理消息失败:', error)
    return NextResponse.json({ error: '处理消息失败' }, { status: 500 })
  }
}
