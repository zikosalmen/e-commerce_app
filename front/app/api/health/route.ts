import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from("categories")
    .select("id")
    .limit(1);

  if (error) {
    return new Response("error", { status: 500 });
  }

  return new Response("ok");
}
