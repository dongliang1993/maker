import { getDatabase } from '@/database'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    const db = getDatabase('server')
    const project = await db.projects.findById(id)

    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 检查用户是否有权限访问该项目
    if (project.user_id !== userId) {
      return NextResponse.json({ error: '无权访问此项目' }, { status: 403 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('获取项目失败:', error)
    return NextResponse.json(
      {
        error: '获取项目失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const db = getDatabase('server')
  const project = await db.projects.findById(params.id)

  if (!project) {
    return NextResponse.json({ error: '项目不存在' }, { status: 404 })
  }

  const { name } = await request.json()

  if (project.user_id !== userId) {
    return NextResponse.json({ error: '无权访问此项目' }, { status: 403 })
  }

  const updatedProject = await db.projects.update(params.id, { name })

  return NextResponse.json(updatedProject)
}
