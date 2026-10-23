import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export function getSupabaseClient() {
  if (!config.supabase.url || !config.supabase.anonKey) {
    return null;
  }
  return createClient(config.supabase.url, config.supabase.anonKey);
}

export function getSupabaseAdmin() {
  if (!config.supabase.url || !config.supabase.serviceRoleKey) {
    return null;
  }
  return createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

