import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { getDatabase } from '@/database'

// 获取项目列表
export async function GET() {
  try {
    // const session = await auth()
    // const userId = session?.userId

    // if (!userId) {
    //   return NextResponse.json(
    //     {
    //       error: '未授权',
    //       details: '请确保已登录并在请求头中包含有效的认证信息',
    //     },
    //     { status: 401 }
    //   )
    // }

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      // .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('数据库查询错误:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return NextResponse.json(
      {
        error: '获取项目列表失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

// 创建新项目
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { name = 'untitled' } = body

    if (!name) {
      return NextResponse.json(
        { error: '项目名称和描述不能为空' },
        { status: 400 }
      )
    }

    const db = getDatabase()

    await db.projects.create({
      name,
      description: 'there is no description',
      user_id: userId,
    })

    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 })
    // }

    // return NextResponse.json(data)
  } catch (error) {
    console.error('创建项目失败:', error)
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 })
  }
}

// 更新项目
export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description } = body

    if (!id || (!name && !description)) {
      return NextResponse.json({ error: '无效的更新数据' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 首先验证项目所有权
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: '无权限修改此项目' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('更新项目失败:', error)
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 })
  }
}

// 删除项目
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 首先验证项目所有权
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: '无权限删除此项目' }, { status: 403 })
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除项目失败:', error)
    return NextResponse.json({ error: '删除项目失败' }, { status: 500 })
  }
}
