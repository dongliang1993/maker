import { createClient as createClientSupabase } from '@supabase/supabase-js'

export function createClient() {
  return createClientSupabase(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}
