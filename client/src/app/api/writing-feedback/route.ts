import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  const { text, taskType = "essay", targetLevel = "B2" } = await req.json();

  if (!text || text.trim().length < 10) {
    return NextResponse.json(
      { error: "Text is too short. Please write at least 10 characters." },
      { status: 400 }
    );
  }

  if (text.trim().length > 5000) {
    return NextResponse.json(
      { error: "Text is too long. Maximum 5000 characters." },
      { status: 400 }
    );
  }

  const systemPrompt = `You are an expert English writing coach. Analyze the provided text and return a JSON object with this exact structure — pure JSON, no markdown, no extra keys:
{
  "overallScore": <integer 0-100>,
  "band": "<CEFR level e.g. A2, B1, B2, C1>",
  "summary": "<2-3 sentence overall assessment>",
  "grammarErrors": [
    {"original": "...", "suggestion": "...", "explanation": "...", "severity": "error|warning|info"}
  ],
  "vocabularySuggestions": [
    {"original": "...", "suggestion": "...", "explanation": "...", "severity": "info"}
  ],
  "coherencePoints": [
    {"original": "...", "suggestion": "...", "explanation": "...", "severity": "warning|info"}
  ],
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "correctedText": "<full corrected version of the input text>"
}
Task type: ${taskType}. Target CEFR level: ${targetLevel}.
Be specific, constructive, and educational. Return valid JSON only.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please analyze this English writing:\n\n${text.trim()}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Writing feedback route error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
