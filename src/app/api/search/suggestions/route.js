import { getSearchSuggestions } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const suggestions = await getSearchSuggestions(query);
  return NextResponse.json(suggestions);
}
