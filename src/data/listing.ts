export const LISTING = {
  address: "42 Ironbark Ridge Road, Rouse Hill NSW 2155",
  headline: "Architectural Masterpiece in Rouse Hill's Premier Enclave",
  priceGuide: "Contact Agent",
  bedrooms: 5,
  bathrooms: 3,
  carSpaces: 2,
  landSize: "650 sqm",
  propertyType: "House",
  yearBuilt: 2022,
  agent: {
    name: "Jag Singh",
    agency: "Jag Singh AI — Private Real Estate Intelligence",
    mobile: "0412 345 678",
    email: "jag@jagsinghai.com.au",
  },
  features: {
    kitchen: [
      "Miele gas cooking with premium 5-burner stovetop",
      "Miele integrated dishwasher",
      "40mm Caesarstone waterfall island bench",
      "Soft-close cabinetry with LED strip lighting",
      "Butler's pantry with second sink and storage",
    ],
    living: [
      "Open-plan living and dining flowing to alfresco",
      "Separate formal lounge with gas fireplace",
      "Raked ceilings in main living (3.2m height)",
      "Engineered oak flooring throughout living areas",
      "Home theatre / media room with acoustic panels",
    ],
    bedrooms: [
      "Master suite with walk-in robe and ensuite with dual vanity, freestanding bath",
      "4 additional bedrooms, all with built-in wardrobes",
      "Bedroom 2 has ensuite access (ideal guest or in-law suite)",
      "Upstairs retreat / study nook between bedrooms",
    ],
    outdoor: [
      "Salt-water heated swimming pool (solar + gas hybrid heating) — usable year-round",
      "Covered alfresco with outdoor kitchen (built-in BBQ and bar fridge)",
      "North-facing backyard — exceptional natural light all day",
      "Low-maintenance landscaped gardens with automated irrigation",
      "Side access gate — room for trailer or small boat",
    ],
    climate: [
      "Ducted zoned air conditioning (Daikin) — 6 zones",
      "Gas fireplace in formal lounge",
      "Ceiling fans in all bedrooms",
      "Double-glazed windows throughout",
    ],
    security: [
      "Alarm system with 8 sensor zones",
      "Video intercom at front door",
      "Auto lock-up garage with internal access",
      "Motion-sensor exterior lighting",
    ],
    smart: [
      "Pre-wired for smart home automation",
      "Gigabit ethernet to all rooms",
      "USB-C charging outlets in kitchen and bedrooms",
    ],
  },
  schoolCatchment: {
    primary: "Ironbark Ridge Public School (300m walk, rated 'Exceeding' by NESA)",
    secondary: "Rouse Hill High School (1.2km)",
    private: "William Clarke College (4-minute drive)",
    earlyChildhood: "Little Explorers Childcare — 500m, rated 'Exceeding'",
  },
  transport: {
    metro: "Rouse Hill Metro Station — 5-minute drive / 12-minute walk",
    bus: "Bus stop on Ironbark Ridge Rd — Route 730 to Parramatta",
    shopping: "Rouse Hill Town Centre — 4-minute drive",
  },
  ownerNotes: [
    "The pool is heated and uses a salt-water system — it costs about $40/month to run year-round.",
    "The backyard faces perfectly north — we get sun from 7am to 5pm even in winter.",
    "We installed the Daikin ducted AC in 2023, it's still under 5-year warranty.",
    "The neighbours on both sides are quiet families — no party houses.",
    "Council approval was already granted for a granny flat if the buyer wants to build one.",
  ],
  inspectionTimes: {
    upcoming: "Saturday 10:00 AM — Priority viewing available",
    note: "Private inspections available by appointment",
  },
};

export function getListingContext(): string {
  const l = LISTING;
  return `
PROPERTY LISTING — CONFIDENTIAL AGENT BRIEF
=============================================
Address: ${l.address}
Headline: ${l.headline}
Price Guide: ${l.priceGuide}
Bedrooms: ${l.bedrooms} | Bathrooms: ${l.bathrooms} | Car Spaces: ${l.carSpaces}
Land Size: ${l.landSize} | Built: ${l.yearBuilt}

KITCHEN:
${l.features.kitchen.map((f) => `• ${f}`).join("\n")}

LIVING AREAS:
${l.features.living.map((f) => `• ${f}`).join("\n")}

BEDROOMS:
${l.features.bedrooms.map((f) => `• ${f}`).join("\n")}

OUTDOOR & POOL:
${l.features.outdoor.map((f) => `• ${f}`).join("\n")}

CLIMATE CONTROL:
${l.features.climate.map((f) => `• ${f}`).join("\n")}

SECURITY:
${l.features.security.map((f) => `• ${f}`).join("\n")}

SMART HOME:
${l.features.smart.map((f) => `• ${f}`).join("\n")}

SCHOOL CATCHMENT:
• Primary: ${l.schoolCatchment.primary}
• Secondary: ${l.schoolCatchment.secondary}
• Private: ${l.schoolCatchment.private}
• Early Childhood: ${l.schoolCatchment.earlyChildhood}

TRANSPORT & AMENITIES:
• Metro: ${l.transport.metro}
• Bus: ${l.transport.bus}
• Shopping: ${l.transport.shopping}

OWNER'S PRIVATE NOTES (not publicly listed):
${l.ownerNotes.map((n) => `• ${n}`).join("\n")}

INSPECTION:
• Next Open: ${l.inspectionTimes.upcoming}
• ${l.inspectionTimes.note}

AGENT:
${l.agent.name} — ${l.agent.agency}
Mobile: ${l.agent.mobile} | Email: ${l.agent.email}
`.trim();
}
