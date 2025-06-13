import { getDatabase } from '@/database'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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

    const db = getDatabase()
    const messages = await db.messages.findByProject(projectId)

    return NextResponse.json(messages)
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
    const { projectId, content, imageUrl } = body

    if (!projectId || !content) {
      return NextResponse.json(
        { error: '项目ID和消息内容不能为空' },
        { status: 400 }
      )
    }

    console.log('创建消息参数:', {
      user_id: userId,
      project_id: projectId,
      content,
      image_url: imageUrl,
      role: 'user',
    })

    const db = getDatabase()
    const message = await db.messages.create({
      user_id: userId,
      project_id: projectId,
      content,
      image_url: imageUrl,
      role: 'user',
    })

    if (!message) {
      console.error('消息创建失败: 返回空消息')
      return NextResponse.json({ error: '消息创建失败' }, { status: 500 })
    }

    console.log('消息创建成功:', message)
    return NextResponse.json(message)
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
