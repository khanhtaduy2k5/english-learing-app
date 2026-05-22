import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { word: string } }
) {
  const word = params.word?.trim().toLowerCase();

  if (!word) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      {
        // Cache the result for 1 hour — dictionary entries rarely change
        next: { revalidate: 3600 },
      }
    );

    if (res.status === 404) {
      return NextResponse.json(
        { error: `No definition found for "${word}"` },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Dictionary service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    // Return the first (best) entry
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("Dictionary route error:", err);
    return NextResponse.json(
      { error: "Failed to fetch definition." },
      { status: 500 }
    );
  }
}
