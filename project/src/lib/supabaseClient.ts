import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Fail loudly in dev so misconfiguration is obvious; still export a client
  // pointing at placeholders so the app can render the setup warning UI.
  console.warn(
    '[NER-SAFE] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  );
}

export const isSupabaseConfigured =
  Boolean(url && anonKey) &&
  !String(url).includes('your-project-ref') &&
  !String(anonKey).includes('your-anon');

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'ner-safe-auth'
    }
  }
);
