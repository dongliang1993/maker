export type {
  Artifact,
  Content,
  Message,
} from './repositories/chat-history.repository'
export type { Project } from './repositories/projects.repository'

export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'DatabaseError' as string
  }
}

export interface DatabaseResult<T> {
  data: T | null
  error: boolean
  message?: string
}

export type DatabaseType = 'client' | 'server'
