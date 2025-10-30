import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    if (!apiKey || !cx) {
      console.error("Missing API credentials in environment variables.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&cx=${cx}`;

    const res = await fetch(url);
    const data = await res.json();

    // Debug: Log full response to terminal
    console.log("🔍 Google API Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      return NextResponse.json(
        { error: `Google API Error: ${data.error.message}` },
        { status: 500 }
      );
    }

    const items = data.items || [];
    const answer =
      items.length > 0
        ? items
            .map(
              (item: any) =>
                `• ${item.title}\n${item.snippet}\n${item.link}\n`
            )
            .join("\n\n")
        : "No results found.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("❌ Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
