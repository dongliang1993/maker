import { NextRequest, NextResponse } from 'next/server'
import { r2StorageService } from '@/services/r2-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 })
    }

    const result = await r2StorageService.uploadFile(file)

    return NextResponse.json(result)
  } catch (error) {
    console.error('上传文件失败:', error)
    return NextResponse.json({ error: '上传文件失败' }, { status: 500 })
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
