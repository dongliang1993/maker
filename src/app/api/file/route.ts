import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { r2StorageService } from '@/services/r2-storage'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只支持图片文件' }, { status: 400 })
    }

    // 限制文件大小（例如：5MB）
    const maxSize = 10 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过 5MB' },
        { status: 400 }
      )
    }

    const key = `${userId}/${Date.now()}-${file.name}`

    const result = await r2StorageService.uploadFile({
      key,
      file,
    })

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error('上传图片失败:', error)
    return NextResponse.json(
      {
        error: '上传图片失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: '未提供文件键' }, { status: 400 })
    }

    const url = r2StorageService.getPublicUrl(key)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('获取文件 URL 失败:', error)
    return NextResponse.json({ error: '获取文件 URL 失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: '未提供文件键' }, { status: 400 })
    }

    await r2StorageService.deleteFile(key)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除文件失败:', error)
    return NextResponse.json({ error: '删除文件失败' }, { status: 500 })
  }
}
