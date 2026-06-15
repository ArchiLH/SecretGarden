import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://exlhynqaiwwjtadfrnkt.supabase.co";
const supabaseKey = "sb_publishable_-qcqHYq7pSoPmw3wbvT-Jw_mM5askaD";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
