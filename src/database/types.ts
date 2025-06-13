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
