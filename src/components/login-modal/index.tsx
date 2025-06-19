'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { Dialog } from '@radix-ui/themes'
import { create } from 'zustand'

// Zustand store 管理模态框状态
interface LoginModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

// 登录模态框组件接口
interface LoginModalProps {
  redirectUrl?: string
}

// 登录模态框组件
export function LoginModal({ redirectUrl = '/projects' }: LoginModalProps) {
  const { isSignedIn } = useAuth()

  if (isSignedIn === undefined || isSignedIn === true) {
    return null
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Title style={{ display: 'none' }}>登录</Dialog.Title>
      {/* 模态框内容 */}
      <Dialog.Content
        style={{
          width: 'fit-content',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <SignIn routing='virtual' fallbackRedirectUrl={'/projects'} />
      </Dialog.Content>
    </Dialog.Root>
  )
}

// 函数式调用方法

// Hook 方式使用（推荐）

// 导出类型
export type { LoginModalProps }

// 默认导出
export default LoginModal
