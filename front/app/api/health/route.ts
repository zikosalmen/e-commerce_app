import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const isCron = req.headers.get("x-vercel-cron");
  if (!isCron) return new Response("unauthorized", { status: 401 });

  // check env
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return new Response("Missing env vars", { status: 500 });
  }

  try {
    // read last run timestamp
    const { data: lastRunData } = await supabase
      .from("cron_meta")
      .select("last_run")
      .eq("id", 1)
      .single();

    const now = new Date();
    const lastRun = lastRunData?.last_run ? new Date(lastRunData.last_run) : null;

    if (!lastRun || now.getTime() - lastRun.getTime() >= 48 * 60 * 60 * 1000) {
      const { error } = await supabase.from("categories").select("id").limit(1);
      if (error) {
        console.error("Supabase error:", error);
        return new Response(JSON.stringify({ status: "error" }), { status: 500 });
      }

      await supabase.from("cron_meta").upsert({ id: 1, last_run: now.toISOString() });
      return new Response(JSON.stringify({ status: "ran" }), { status: 200 });
    }

    return new Response(JSON.stringify({ status: "skipped" }), { status: 200 });

  } catch (err) {
    console.error("Health API error:", err);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
}
