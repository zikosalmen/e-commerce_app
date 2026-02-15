import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const token = req.headers.get("auth")

  if (token !== `Bearer ${process.env.AI_AGENT_TOKEN_KNOWLEDGE}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (!supabase) {
    return new Response("Supabase is not configured", { status: 500 })
  }

  const { data } = await supabase
    .from("products")
    .select("id,name,price,image_url")

  return Response.json(data)
}
