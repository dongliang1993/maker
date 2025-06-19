import { ChatHistoryRepository } from './repositories/chat-history.repository'
import { ProjectsRepository } from './repositories/projects.repository'

import type { DatabaseType, DBMessage } from './types'

class Database {
  readonly projects: ProjectsRepository
  readonly chatHistory: ChatHistoryRepository

  constructor(type: DatabaseType) {
    this.projects = new ProjectsRepository({
      type,
    })
    this.chatHistory = new ChatHistoryRepository({
      type,
    })
  }
}

const db = new Database('server')

export async function saveMessages({
  messages,
}: {
  messages: Array<Omit<DBMessage, 'created_at'>>
}) {
  try {
    return await db.chatHistory.upsertMany(messages)
  } catch (error) {
    console.error(`[error] Failed to save messages: ${error}`)
  }
}

export async function getMessagesByChatId({ chatId }: { chatId: string }) {
  try {
    const { data, error } = await db.chatHistory.findByProject(chatId)

    if (error) {
      console.error(`[error] Failed to get messages by chat id: ${error}`)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(`[error] Failed to get messages by chat id: ${error}`)
    return []
  }
}
