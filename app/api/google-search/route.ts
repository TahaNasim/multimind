import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    return NextResponse.json(
      { error: "Google API credentials missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
        q
      )}&num=5`
    );

    if (!response.ok) throw new Error("Google API request failed");

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        answer: "No results found.",
      });
    }

    // Build full answer from all results
    let fullAnswer = `🔍 **Web Search Results for:** ${q}\n\n`;

    data.items.forEach((item: any, index: number) => {
      fullAnswer += `### ${index + 1}. ${item.title}\n`;
      fullAnswer += `${item.snippet || "No snippet available."}\n`;
      fullAnswer += `**Source:** ${item.link}\n\n`;
    });

    return NextResponse.json({ answer: fullAnswer });
  } catch (error) {
    console.error("Google Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
