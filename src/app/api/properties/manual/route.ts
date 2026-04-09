import { NextRequest, NextResponse } from "next/server";
import { registerProperty } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";

interface ManualBody {
  address?: string;
  description?: string;
  beds?: number;
  baths?: number;
  cars?: number;
  price?: string;
  propertyType?: string;
  headline?: string;
}

function slugifyAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ManualBody;
    const address = body.address?.trim();
    const description = body.description?.trim();

    if (!address || !description) {
      return NextResponse.json(
        { ok: false, reason: "invalid_input" },
        { status: 400 }
      );
    }

    const property: Property = {
      id: crypto.randomUUID(),
      slug: slugifyAddress(address),
      source: "manual",
      createdAt: new Date().toISOString(),
      address,
      headline: body.headline?.trim() || address,
      priceGuide: body.price?.trim() || "Contact Agent",
      propertyType: body.propertyType?.trim() || "Residence",
      bedrooms: numFrom(body.beds),
      bathrooms: numFrom(body.baths),
      carSpaces: numFrom(body.cars),
      description,
    };

    registerProperty(property);
    return NextResponse.json({ ok: true, property });
  } catch (error) {
    console.error("manual route error:", error);
    return NextResponse.json(
      { ok: false, reason: "invalid_input" },
      { status: 400 }
    );
  }
}

function numFrom(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === "string") {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  return 0;
}
