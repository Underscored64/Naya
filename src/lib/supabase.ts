// Single Supabase client for the whole app.
// Reads the public anon key + URL from Vite env vars (never the service role key).
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in dev so a missing .env does not look like a silent bug.
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — " +
      "copy .env.example to .env and fill them in.",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
