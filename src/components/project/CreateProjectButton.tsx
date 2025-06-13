'use client'

import { projectService } from '@/lib/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

export function CreateProjectButton() {
  const { user } = useUser()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = async () => {
    if (!user || isCreating) return

    try {
      setIsCreating(true)
      // 使用客户端 Supabase 创建项目
      await projectService.createProject({
        name: '新项目',
        description: '项目描述',
        user_id: user.id,
      })

      // 可以添加成功提示或刷新项目列表
    } catch (error) {
      console.error('Failed to create project:', error)
      // 可以添加错误提示
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <button
      onClick={handleCreateProject}
      disabled={isCreating}
      className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50'
    >
      {isCreating ? '创建中...' : '创建项目'}
    </button>
  )
}
