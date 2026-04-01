import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const isCron = req.headers.get("x-vercel-cron");

  if (!isCron) {
    return new Response("unauthorized", { status: 401 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return new Response("Missing env vars", { status: 500 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { error } = await supabase
    .from("categories")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}
