import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getDatabase } from '@/database'
import { GPTService } from '@/lib/gpt'
// import { imageGenerator } from '@/services/image-generator'

const messageSchema = z.object({
  projectId: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
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

// 获取项目的消息列表
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: '缺少项目ID' }, { status: 400 })
    }

    const db = getDatabase('server')
    const { data, error, message } = await db.messages.findByProject(projectId)

    if (error) {
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error('获取消息失败:', error)
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

    const body = await request.json()
    const { imageUrl, messages, data } = body
    console.log(body, 'body')

    const { content, projectId } = messageSchema.parse(JSON.parse(data))

    const saveMessage = async ({
      content,
      role,
    }: {
      content: string
      role: 'user' | 'assistant'
    }) => {
      await db.messages.create({
        user_id: userId,
        project_id: projectId,
        content,
        role,
      })
    }

    const db = getDatabase('server')

    await saveMessage({
      content,
      role: 'user',
    })

    const userIntent = await GPTService.tryGetUserIntent(content)

    // const db = getDatabase('server')
    // const userIntent = await GPTService.tryGetUserIntent(content)

    switch (userIntent) {
      case 'generation':
        break
      case 'edit':
        break
      case 'other':
        const result = await GPTService.completions({
          messages,
          onStepFinish: (response) => {
            const text = response?.text
            if (text) {
              saveMessage({
                content: text,
                role: 'assistant',
              })
            }
          },
        })

        return result.toDataStreamResponse()
    }

    // let finalImageUrl = imageUrl

    // if (finalImageUrl) {
    //   // 创建用户消息
    //   await db.messages.create({
    //     user_id: userId,
    //     project_id: projectId,
    //     content,
    //     image_url: finalImageUrl,
    //     role: 'user',
    //   })
    // } else {
    //   // 如果 imageUrl 为空，寻找上一条消息的图片
    //   const db = getDatabase('server')
    //   const { data, error, message } = await db.messages.findByProject(
    //     projectId
    //   )

    //   if (error || !data) {
    //     return NextResponse.json({ error: message }, { status: 500 })
    //   }

    //   // 从后往前遍历消息，找到第一条有图片的消息
    //   for (let i = data.length - 1; i >= 0; i--) {
    //     const message = data[i]
    //     if (message.image_url) {
    //       finalImageUrl = message.image_url
    //       break
    //     }
    //   }
    // }

    // if (!finalImageUrl) {
    //   return NextResponse.json({ error: '没有找到图片' }, { status: 400 })
    // }

    // // 如果有图片，调用 Flux API
    // try {
    //   // 添加处理中的消息
    //   await db.messages.create({
    //     user_id: userId,
    //     project_id: projectId,
    //     content: '正在处理图片，请稍候...',
    //     role: 'assistant',
    //   })

    //   // 调用 Flux API
    //   const { data } = await imageGenerator.generations({
    //     prompt: content,
    //     image_url: finalImageUrl,
    //     model: 'flux-kontext-pro',
    //   })

    //   if (data.length > 0) {
    //     // 添加生成的图片消息
    //     await db.messages.create({
    //       user_id: userId,
    //       project_id: projectId,
    //       content: '图片生成完成',
    //       image_url: data[0].url,
    //       role: 'assistant',
    //     })
    //   } else {
    //     throw new Error('生成的图片 URL 为空')
    //   }
    // } catch (error) {
    //   console.error('图片处理错误:', error)
    //   // 添加错误消息
    //   await db.messages.create({
    //     user_id: userId,
    //     project_id: projectId,
    //     content:
    //       error instanceof Error ? error.message : '图片处理失败，请重试',
    //     role: 'assistant',
    //   })
    // }

    // return NextResponse.json({ message: '图片处理成功' })
  } catch (error) {
    console.error('创建消息失败:', error)
    return NextResponse.json(
      {
        error: '创建消息失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
