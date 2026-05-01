import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

function getSupabaseConfig() {
  // These values are safe to expose because Supabase anon keys are meant for browser use.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPlaceholderConfig =
    supabaseUrl === 'your_project_url' || supabaseAnonKey === 'your_anon_key';

  if (!supabaseUrl || !supabaseAnonKey || isPlaceholderConfig) {
    throw new Error(
      'Supabase is not configured. Set real values for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local and restart the dev server.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function isSupabaseConfigured() {
  // Pages call this before auth actions so users get a helpful setup message.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== 'your_project_url' &&
    supabaseAnonKey !== 'your_anon_key'
  );
}

export function getSupabaseBrowserClient() {
  // Reuse one browser client instead of creating a new connection helper each time.
  if (browserClient) return browserClient;

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
