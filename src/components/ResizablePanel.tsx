'use client'

import { cn } from '@/lib/utils'
import { Flex } from '@radix-ui/themes'
import { useCallback, useEffect, useState } from 'react'

interface ResizablePanelProps {
  className?: string
  children: (width: number) => React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizablePanel({
  className,
  children,
  defaultWidth = 480,
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
      style={{ position: 'relative', width }}
      className={cn('max-w-full', className)}
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
      {children(width)}
    </Flex>
  )
}
