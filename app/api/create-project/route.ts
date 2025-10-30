import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    const prompt = `
You are an AI project assistant. Based on the user input, generate a structured project setup:
Title: ${title}
Description: ${description}

Return JSON with:
{
  "project_name": "...",
  "summary": "...",
  "tasks": ["...", "...", "..."]
}`;

    // ✅ Call OpenRouter API directly
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or another model like "meta-llama/llama-3.1-8b-instruct"
        messages: [
          { role: "system", content: "You are an intelligent project planner." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    const result = JSON.parse(data.choices[0].message.content || "{}");

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
