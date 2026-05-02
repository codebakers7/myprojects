"use client";

import { createClient } from "@/lib/supabase/client";

export function SupabaseDemo() {
  const supabase = createClient();
  // use supabase.from('users').select() etc.
  return null;
}