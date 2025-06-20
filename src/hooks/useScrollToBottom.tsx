import { useCallback, useEffect, useRef } from 'react'
import { create } from 'zustand'

const useScrollStore = create<{
  isAtBottom: boolean
  scrollBehavior: ScrollBehavior | boolean
  setIsAtBottom: (isAtBottom: boolean) => void
  setScrollBehavior: (scrollBehavior: ScrollBehavior | boolean) => void
}>((set) => ({
  isAtBottom: false,
  scrollBehavior: false,
  setIsAtBottom: (isAtBottom: boolean) => set({ isAtBottom }),
  setScrollBehavior: (scrollBehavior: ScrollBehavior | boolean) =>
    set({ scrollBehavior }),
}))

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const isAtBottom = useScrollStore((state) => state.isAtBottom)
  const setIsAtBottom = useScrollStore((state) => state.setIsAtBottom)
  const scrollBehavior = useScrollStore((state) => state.scrollBehavior)
  const setScrollBehavior = useScrollStore((state) => state.setScrollBehavior)

  useEffect(() => {
    console.log('scrollBehavior', scrollBehavior)
    if (scrollBehavior) {
      if (typeof scrollBehavior === 'string') {
        endRef.current?.scrollIntoView({ behavior: scrollBehavior })
      } else {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      setScrollBehavior(false)
    }
  }, [setScrollBehavior, scrollBehavior])

  const scrollToBottom = useCallback(
    (scrollBehavior: ScrollBehavior = 'smooth') => {
      setScrollBehavior(scrollBehavior)
    },
    [setScrollBehavior]
  )

  function onViewportEnter() {
    setIsAtBottom(true)
  }

  function onViewportLeave() {
    setIsAtBottom(false)
  }

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  }
}
