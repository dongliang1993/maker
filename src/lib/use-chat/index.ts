import { UIMessage as UIMessageFormAI } from 'ai'

import { ChatProvider } from './provider'
import { useChatStore as useStoreHook } from './store'

import type { Content } from '@/database/types'
import type { ImageList, StyleList } from '@/types/project'

type UIMessage = Omit<UIMessageFormAI, 'content'> & {
  image_list?: ImageList
  style_list?: StyleList
  text: string
  content?: Content[]
  name?: string
}

export { ChatProvider, useStoreHook as useChatStore }

export type { UIMessage }

// A simplified hook for components to use.
export const useChat = () => useStoreHook((state) => state)
