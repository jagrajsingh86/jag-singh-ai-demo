import type { Property } from "./types";

export type ScrapeResult =
  | {
      ok: true;
      property: Omit<Property, "id" | "slug" | "source" | "createdAt">;
    }
  | {
      ok: false;
      reason: "blocked" | "no_jsonld" | "parse_error" | "network_error";
    };

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ACCEPTED_TYPES = new Set([
  "RealEstateListing",
  "Residence",
  "SingleFamilyResidence",
  "Apartment",
  "House",
  "Product",
  "Place",
  "Accommodation",
]);

export async function scrapePropertyFromUrl(
  url: string
): Promise<ScrapeResult> {
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-AU,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 403 || res.status === 429) {
      return { ok: false, reason: "blocked" };
    }
    if (!res.ok) {
      return { ok: false, reason: "network_error" };
    }
    html = await res.text();

    // Detect Cloudflare interstitial / JS-only challenge pages.
    if (
      /cf-challenge|cloudflare|just a moment|attention required/i.test(html) &&
      html.length < 30_000
    ) {
      return { ok: false, reason: "blocked" };
    }
  } catch {
    return { ok: false, reason: "network_error" };
  }

  // Extract all <script type="application/ld+json"> blocks via regex.
  const scriptRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks: unknown[] = [];
  let m: RegExpExecArray | null;
  while ((m = scriptRegex.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else if (parsed && typeof parsed === "object") {
        // Schema.org @graph wrapper
        const graph = (parsed as { "@graph"?: unknown[] })["@graph"];
        if (Array.isArray(graph)) {
          blocks.push(...graph);
        } else {
          blocks.push(parsed);
        }
      }
    } catch {
      // skip malformed blocks
    }
  }

  if (blocks.length === 0) {
    return { ok: false, reason: "no_jsonld" };
  }

  const matching = blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const t = (b as Record<string, unknown>)["@type"];
    if (Array.isArray(t)) {
      return t.some((x) => typeof x === "string" && ACCEPTED_TYPES.has(x));
    }
    return typeof t === "string" && ACCEPTED_TYPES.has(t);
  });

  if (!matching) {
    return { ok: false, reason: "no_jsonld" };
  }

  try {
    const property = normaliseLdJson(
      matching as Record<string, unknown>,
      url
    );
    return { ok: true, property };
  } catch {
    return { ok: false, reason: "parse_error" };
  }
}

function normaliseLdJson(
  data: Record<string, unknown>,
  sourceUrl: string
): Omit<Property, "id" | "slug" | "source" | "createdAt"> {
  const addressRaw = data.address;
  let address = "Unknown address";
  if (typeof addressRaw === "string") {
    address = addressRaw;
  } else if (addressRaw && typeof addressRaw === "object") {
    const a = addressRaw as Record<string, unknown>;
    address = [
      a.streetAddress,
      a.addressLocality,
      a.addressRegion,
      a.postalCode,
    ]
      .filter((x) => typeof x === "string" && x.length > 0)
      .join(", ");
    if (!address) address = String(data.name ?? "Unknown address");
  } else if (data.name) {
    address = String(data.name);
  }

  const headline =
    typeof data.name === "string" && data.name.length > 0
      ? data.name
      : address;

  const bedrooms = numFrom(
    data.numberOfBedrooms ?? data.numberOfRooms ?? data.numberOfBedroomsTotal
  );
  const bathrooms = numFrom(
    data.numberOfBathroomsTotal ??
      data.numberOfFullBathrooms ??
      data.numberOfBathrooms
  );
  const carSpaces = numFrom(
    data.numberOfVehicleSpaces ?? data.numberOfParkingSpaces
  );

  const offers = data.offers as Record<string, unknown> | undefined;
  let priceGuide = "Contact Agent";
  if (offers && typeof offers === "object") {
    const price = offers.price ?? offers.lowPrice;
    const currency = offers.priceCurrency ?? "AUD";
    if (price !== undefined && price !== null && String(price).length > 0) {
      priceGuide = `${currency} ${price}`;
    }
  } else if (typeof data.price === "string") {
    priceGuide = data.price;
  }

  const floorSize = data.floorSize as Record<string, unknown> | undefined;
  let landSize: string | undefined;
  if (floorSize && typeof floorSize === "object" && floorSize.value) {
    const unit = floorSize.unitCode ?? floorSize.unitText ?? "m²";
    landSize = `${floorSize.value} ${unit}`;
  }

  const description =
    typeof data.description === "string" ? data.description : "";

  const propertyType = (() => {
    const t = data["@type"];
    if (typeof t === "string") return t;
    if (Array.isArray(t) && typeof t[0] === "string") return t[0];
    return "Residence";
  })();

  return {
    address,
    headline,
    priceGuide,
    propertyType,
    bedrooms,
    bathrooms,
    carSpaces,
    landSize,
    description,
    sourceUrl,
  };
}

function numFrom(value: unknown): number {
  if (typeof value === "number") return Math.max(0, Math.floor(value));
  if (typeof value === "string") {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  if (value && typeof value === "object") {
    const v = (value as Record<string, unknown>).value;
    if (typeof v === "number") return Math.max(0, Math.floor(v));
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? Math.max(0, n) : 0;
    }
  }
  return 0;
}
