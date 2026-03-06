import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { imageBase64, mediaType } = await request.json();

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your environment variables." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: `You are a brutally honest data visualization expert and dashboard design critic.

You MUST respond using EXACTLY these section headers:

VERDICT
One punchy sentence (max 20 words) summarizing the biggest problem or saving grace.

SCORE
X/10

CRITICAL ISSUES
- Issue Title: explanation
- Issue Title: explanation

WARNINGS
- Warning Title: explanation
- Warning Title: explanation

POSITIVES
- Positive Title: what works and why

RECOMMENDATIONS
- Recommendation Title: specific actionable step and why it matters
- Recommendation Title: specific actionable step and why it matters
- Recommendation Title: specific actionable step and why it matters
- Recommendation Title: specific actionable step and why it matters
- Recommendation Title: specific actionable step and why it matters

LAYOUT SUGGESTION
ASCII box layout showing how the dashboard SHOULD be restructured.

Be specific to what you actually see. Reference real elements. Do not be generic.`
            }
          ]
        }]
      }),
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.content.map((b) => b.text || "").join("\n");
    return NextResponse.json({ text });

  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
