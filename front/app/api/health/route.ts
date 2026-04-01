//cron job

import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from("your_table")
    .select("id")
    .limit(1);

  if (error) {
    return new Response("error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
