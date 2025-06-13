import { MessagesRepository } from './repositories/messages.repository'
import { ProjectsRepository } from './repositories/projects.repository'

export class Database {
  readonly projects: ProjectsRepository
  readonly messages: MessagesRepository

  constructor() {
    this.projects = new ProjectsRepository()
    this.messages = new MessagesRepository()
  }
}

// 创建数据库实例的工厂函数
export function createDatabase(): Database {
  return new Database()
}

// 创建数据库实例的工厂函数
export function getDatabase(): Database {
  return new Database()
}
