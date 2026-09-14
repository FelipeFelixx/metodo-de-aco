import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'sb_publishable_placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL ?? '#';
