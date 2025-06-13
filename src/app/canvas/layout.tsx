'use client'

import { Flex } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { useProject } from '@/services/project'

interface CanvasLayoutProps {
  children: React.ReactNode
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  const { data: projectData, update } = useProject(projectId!)

  const handleUpdateProject = async (name: string) => {
    if (!projectId) {
      return
    }

    update(
      { name },
      {
        onSuccess: () => {},
      }
    )
  }

  return (
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
          defaultValue={projectData?.name}
          className='outline-none cursor-text border-b border-dashed border-transparent leading-none hover:border-[#2F3640] w-fit max-w-1/2'
          onBlur={(e) => handleUpdateProject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // 释放焦点
              ;(e.target as HTMLInputElement).blur()
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
  )
}
