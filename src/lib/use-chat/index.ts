import { ChatProvider } from './provider'
import { useChatStore as useStoreHook } from './store'

export { ChatProvider, useStoreHook as useChatStore }

// A simplified hook for components to use.
export const useChat = () => useStoreHook((state) => state)
