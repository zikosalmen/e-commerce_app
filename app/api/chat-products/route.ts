import { supabase } from "@/front/lib/supabase"

export async function GET(req: Request) {
  const token = req.headers.get("auth")
  if (token !== `Bearer ${process.env.AI_AGENT_TOKEN_KNOWLEDGE}`) {
    return new Response("Unauthorized", { status: 401 })
  }
if (!supabase) { return new Response("Supabase client not initialized", { status: 500 }) }
  const url = new URL(req.url)

  const category = url.searchParams.get("category")
  const brand = url.searchParams.get("brand")
  const name = url.searchParams.get("name")
  const promo = url.searchParams.get("promo")
  const limit = Number(url.searchParams.get("limit") ?? 10)

  let query = supabase
    .from("Product")
    .select("name,price,imageUrl,categoryId,brand,description,stock,promo")

  if (name) {
    query = query.ilike("name", `%${name}%`)
  }

  if (category) {
    query = query.eq("categoryId", category)
  }

  if (brand) {
    query = query.eq("brand", brand)
  }

  if (promo === "true") {
    query = query.eq("promo", true)
  }

  const { data, error } = await query.range(0, limit - 1)

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  return Response.json(data)
}
