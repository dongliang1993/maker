import { type UseChatOptions, useChat as useChatAiSdk } from '@ai-sdk/react'
import { useContext, useEffect, useRef } from 'react'
import { ChatStoreApi, ChatStoreContext, createChatStore } from './store'

export type ChatStoreProviderProps = {
  children: React.ReactNode
}

// The controller component that bridges the hook and the store.
const ChatController = (options: UseChatOptions) => {
  const store = useContext(ChatStoreContext)
  if (!store) throw new Error('Missing ChatStoreContext.Provider')

  const chat = useChatAiSdk(options)

  useEffect(() => {
    // Sync the chat state to the store.
    store.getState().set(chat)
  }, [store, chat])

  return null
}

export const ChatStoreProvider = ({
  children,
  ...options
}: ChatStoreProviderProps & UseChatOptions) => {
  const storeRef = useRef<ChatStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createChatStore()
  }

  return (
    <ChatStoreContext.Provider value={storeRef.current}>
      <ChatController {...options} />
      {children}
    </ChatStoreContext.Provider>
  )
}
