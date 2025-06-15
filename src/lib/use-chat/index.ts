import { useChatStore as useStoreHook } from './store'

export { useStoreHook as useChatStore }

// A simplified hook for components to use.
export const useChat = () => useStoreHook((state) => state)
