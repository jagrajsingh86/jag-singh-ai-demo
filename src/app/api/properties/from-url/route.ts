import { NextRequest, NextResponse } from "next/server";
import { scrapePropertyFromUrl } from "@/lib/jsonLdScraper";
import { registerProperty } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";

function slugifyAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { ok: false, reason: "invalid_input" },
        { status: 400 }
      );
    }

    const result = await scrapePropertyFromUrl(url);
    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason });
    }

    const property: Property = {
      id: crypto.randomUUID(),
      slug: slugifyAddress(result.property.address),
      source: "url",
      createdAt: new Date().toISOString(),
      ...result.property,
    };
    registerProperty(property);

    return NextResponse.json({ ok: true, property });
  } catch (error) {
    console.error("from-url route error:", error);
    return NextResponse.json(
      { ok: false, reason: "network_error" },
      { status: 500 }
    );
  }
}
