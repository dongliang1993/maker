import { type Message, type UseChatHelpers } from '@ai-sdk/react'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

export { type Message }

export type ChatState = UseChatHelpers & {
  set: (data: Partial<UseChatHelpers>) => void
}

export const defaultState: UseChatHelpers = {
  messages: [],
  input: '',
  isLoading: false,
  error: undefined,
  status: 'ready',
  id: '',
  experimental_resume: async () => {
    console.warn('experimental_resume called before chat is initialized')
    return null
  },
  handleInputChange: () => {
    console.warn('handleInputChange called before chat is initialized')
  },
  handleSubmit: () => {
    console.warn('handleSubmit called before chat is initialized')
  },
  reload: async () => {
    console.warn('reload called before chat is initialized')
    return null
  },
  stop: () => {
    console.warn('stop called before chat is initialized')
  },
  append: async () => {
    console.warn('append called before chat is initialized')
    return null
  },
  setMessages: () => {
    console.warn('setMessages called before chat is initialized')
  },
  setInput: () => {
    console.warn('setInput called before chat is initialized')
  },
  setData: async () => {
    console.warn('setData called before chat is initialized')
    return null
  },
}

export type ChatStoreApi = ReturnType<typeof createChatStore>

export const ChatStoreContext = createContext<ChatStoreApi | null>(null)

export const createChatStore = () => {
  return createStore<ChatState>()((set) => ({
    ...defaultState,
    set: (data) => set(data),
  }))
}

export const useChatStore = <T>(selector: (store: ChatState) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext)

  if (!chatStoreContext) {
    throw new Error(`useChatStore must be used within ChatStoreProvider`)
  }

  return useStore(chatStoreContext, selector)
}
