import { ProjectsRepository } from './repositories/projects.repository'

export class Database {
  readonly projects: ProjectsRepository

  constructor() {
    this.projects = new ProjectsRepository()
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
