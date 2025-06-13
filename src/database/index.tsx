import { MessagesRepository } from './repositories/messages.repository'
import { ProjectsRepository } from './repositories/projects.repository'
import { DatabaseType } from './types'

export class Database {
  readonly projects: ProjectsRepository
  readonly messages: MessagesRepository

  constructor(type: DatabaseType) {
    this.projects = new ProjectsRepository({
      type,
    })
    this.messages = new MessagesRepository({
      type,
    })
  }
}

// 创建数据库实例的工厂函数
export function getDatabase(type: DatabaseType): Database {
  return new Database(type)
}
