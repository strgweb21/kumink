export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    const res = await fetch(url)
    const html = await res.text()

    const match = html.match(/<title>(.*?)<\/title>/i)

    const title = match ? match[1] : ""

    return Response.json({ title })
  } catch {
    return Response.json({ title: "" })
  }
}