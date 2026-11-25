import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

// A merchant profile row. One per auth user; RLS keeps every user's row
// isolated (they can only ever read or write their own line).
export interface ProfileRow {
  user_id: string;
  display_name: string;
  business_name: string | null;
  created_at: string;
}

// TanStack Query keys, shared so we can invalidate in one place.
export const queries = {
  profile: ["profile", "me"] as const,
};

// A brand-new user gets a `profiles` row created automatically by a Postgres
// trigger on `auth.users` (see supabase/schema.sql) which reads `display_name`
// from the user metadata passed at sign-up. This upsert is the write primitive
// for later edits (e.g. changing the display name in Settings).
export async function upsertProfile(
  userId: string,
  displayName: string,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, display_name: displayName }, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

// Read the current user's profile through TanStack Query (cached, revalidated).
export function useProfile() {
  return useQuery({
    queryKey: queries.profile,
    queryFn: async (): Promise<ProfileRow> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session?.user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("profile-not-found");
      return data as ProfileRow;
    },
  });
}

// Revalidate the cached profile after a write elsewhere in the app.
export function useRefreshProfile() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queries.profile });
}
