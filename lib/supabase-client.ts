import { createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export { supabase };

export default supabase;
