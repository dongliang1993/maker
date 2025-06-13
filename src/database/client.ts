import { SupabaseClient } from '@supabase/supabase-js'

import { createAdminClient } from '@/lib/supabase/server'

import { DatabaseError } from './types'

export class DatabaseClient {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = createAdminClient()
  }

  /**
   * 处理数据库错误
   */
  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new DatabaseError(error.message)
    }
    throw new DatabaseError('未知数据库错误')
  }

  /**
   * 检查操作结果
   */
  protected checkResult<T>(result: { data: T | null; error: unknown }): T {
    console.log('🔍 检查操作结果:', result)
    if (result.error) {
      const message = (result.error as Error).message || '未知错误'

      return {
        data: null,
        error: true,
        message,
      }
    }

    if (!result.data) {
      throw new DatabaseError('未找到数据')
    }

    return result.data as T
  }

  /**
   * 通用查询方法
   */
  protected async query<T>(
    callback: (
      supabase: SupabaseClient
    ) => Promise<{ data: T | null; error: unknown }>
  ): Promise<T> {
    try {
      const result = await callback(this.supabase)
      return result //this.checkResult(result)
    } catch (error) {
      this.handleError(error)
    }
  }
}
