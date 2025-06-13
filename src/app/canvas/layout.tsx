'use client'

import { Flex, Skeleton } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getDatabase } from '@/database'
import type { Project } from '@/database/types'

interface CanvasLayoutProps {
  children: React.ReactNode
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateProject = async (name: string) => {
    if (!projectId) {
      setError('项目ID不能为空')
      return
    }

    const db = getDatabase('client')
    const { error, message } = await db.projects.update(projectId, { name })
    if (error) {
      setError(message ?? '更新项目失败')
      return
    }
    setProject({ ...project, name } as Project)
  }

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setError('项目ID不能为空')
        setIsLoading(false)
        return
      }

      try {
        const db = getDatabase('client')
        const projectData = await db.projects.findById(projectId)
        if (!projectData) {
          setError('项目不存在')
        } else {
          setProject(projectData)
          setError(null)
        }
      } catch (err) {
        setError('加载项目失败')
        console.error('Failed to load project:', err)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    loadProject()
  }, [projectId])

  return (
    <Skeleton loading={isLoading}>
      <Flex
        direction='column'
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <Flex
          px='4'
          py='2'
          align='center'
          justify='center'
          style={{
            borderBottom: '1px solid var(--gray-a4)',
            backgroundColor: 'var(--gray-a2)',
          }}
        >
          <input
            defaultValue={project?.name}
            className='outline-none cursor-text border-b border-dashed border-transparent leading-none hover:border-[#2F3640] w-fit max-w-1/2'
            onBlur={(e) => handleUpdateProject(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdateProject((e.target as HTMLInputElement).value)
              }
            }}
          />
        </Flex>

        <Flex
          style={{
            position: 'relative',
            flex: 1,
          }}
        >
          {children}
        </Flex>
      </Flex>
    </Skeleton>
  )
}
