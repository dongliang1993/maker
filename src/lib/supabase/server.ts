// 'use server'

import { createServerClient } from '@supabase/ssr'

// 管理员客户端（使用service_role密钥）
export function createAdminClient() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // 管理员客户端不需要设置cookies
        },
      },
    }
  )
}
