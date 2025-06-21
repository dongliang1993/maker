'use client'

import { Flex } from '@radix-ui/themes'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface ResizablePanelProps {
  id?: string
  className?: string
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizablePanel({
  id,
  className,
  children,
  defaultWidth = 320,
  minWidth = 320,
  maxWidth = 600,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth)
        }
      }
    },
    [isResizing, minWidth, maxWidth]
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return (
    <Flex
      id={id}
      style={{ width }}
      className={cn(
        'max-w-full duration-200 ease-in-out transition-[width,height,top]',
        className
      )}
    >
      <div
        style={{
          position: 'absolute',
          left: -4,
          top: 0,
          bottom: 0,
          width: 8,
          cursor: 'col-resize',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onMouseDown={startResizing}
      />
      {children}
    </Flex>
  )
}
