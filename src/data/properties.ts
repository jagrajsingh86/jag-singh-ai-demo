import type { Property } from "@/lib/types";

const NOW = "2026-01-01T00:00:00.000Z";

const JAG_AGENT = {
  name: "Jag Singh",
  agency: "Jag Singh AI — Private Real Estate Intelligence",
  mobile: "0412 345 678",
  email: "jag@jagsinghai.com.au",
};

export const CURATED_PROPERTIES: Property[] = [
  // ── 1. Original luxury family house ──
  {
    id: "42-ironbark-ridge-rouse-hill",
    slug: "42-ironbark-ridge-rouse-hill",
    source: "curated",
    createdAt: NOW,
    address: "42 Ironbark Ridge Road, Rouse Hill NSW 2155",
    headline: "Architectural Masterpiece in Rouse Hill's Premier Enclave",
    priceGuide: "Contact Agent",
    propertyType: "House",
    bedrooms: 5,
    bathrooms: 3,
    carSpaces: 2,
    landSize: "650 sqm",
    yearBuilt: 2022,
    agent: JAG_AGENT,
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
  },

  // ── 2. Luxury Sydney CBD apartment ──
  {
    id: "2201-horizon-tower-barangaroo",
    slug: "2201-horizon-tower-barangaroo",
    source: "curated",
    createdAt: NOW,
    address: "Apartment 2201, Horizon Tower, 1 Sussex Street, Barangaroo NSW 2000",
    headline: "Sub-Penthouse with Uninterrupted Harbour & Bridge Views",
    priceGuide: "$4,200,000 — $4,600,000",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    carSpaces: 2,
    landSize: "198 sqm internal + 32 sqm balcony",
    yearBuilt: 2021,
    agent: JAG_AGENT,
    features: {
      kitchen: [
        "Gaggenau induction cooktop and integrated oven",
        "Sub-Zero integrated fridge / freezer",
        "Calacatta marble island bench with waterfall edge",
        "Concealed butler's pantry with second sink and Vintec wine fridge",
        "Zip HydroTap for filtered boiling/chilled/sparkling",
      ],
      living: [
        "Floor-to-ceiling glazing facing Sydney Harbour Bridge and Opera House",
        "Open-plan living with 3.1m ceilings",
        "Wide-plank European oak flooring",
        "Custom built-in entertainment unit with concealed cabling",
      ],
      bedrooms: [
        "Master suite with walk-through robe, ensuite with marble vanity and freestanding bath",
        "2 additional bedrooms each with built-in robes and ensuites",
        "Blockout motorised blinds to all bedrooms",
      ],
      outdoor: [
        "32 sqm wraparound balcony with glass balustrade",
        "Direct view of NYE fireworks",
        "Building amenities: 25m heated lap pool, sauna, gym, residents lounge",
      ],
      climate: [
        "Ducted zoned reverse-cycle air conditioning",
        "Triple-glazed acoustic windows",
      ],
      security: [
        "24/7 concierge and security",
        "Secure key-card lift access to floor",
        "Video intercom",
      ],
      smart: [
        "Crestron smart home with app control",
        "Integrated Sonos throughout",
        "EV charging point in secure carpark",
      ],
    },
    schoolCatchment: {
      primary: "Fort Street Public School (1.4 km)",
      secondary: "Sydney Secondary College Balmain Campus",
      private: "SCEGGS Darlinghurst, St Mary's Cathedral College",
      earlyChildhood: "Barangaroo Childcare — in building",
    },
    transport: {
      metro: "Barangaroo Metro Station — 3-minute walk",
      bus: "Wynyard transport hub — 8-minute walk",
      shopping: "Barangaroo Avenue — supermarket, restaurants, bars at street level",
    },
    ownerNotes: [
      "Strata is $4,200/quarter and includes building insurance, gym, pool, concierge, and lift maintenance.",
      "We moved up from the 12th floor to this one for the bridge view — it makes a huge difference at night.",
      "The acoustic windows are remarkable — even with the harbour traffic you hear nothing inside.",
      "Both car spaces are tandem and there's a 5 sqm storage cage included.",
    ],
    inspectionTimes: {
      upcoming: "Saturday 11:30 AM — Private appointments preferred",
      note: "Strict no-photo policy in respect of vendor",
    },
  },

  // ── 3. Investment unit (yield play) ──
  {
    id: "unit-14-89-maitland-st-newcastle",
    slug: "unit-14-89-maitland-st-newcastle",
    source: "curated",
    createdAt: NOW,
    address: "Unit 14, 89 Maitland Street, Newcastle West NSW 2302",
    headline: "Tenanted Investment Unit — 5.4% Net Yield",
    priceGuide: "$485,000",
    propertyType: "Unit",
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    landSize: "76 sqm",
    yearBuilt: 2018,
    agent: JAG_AGENT,
    features: {
      kitchen: [
        "Stone benchtops",
        "Stainless steel electric oven and cooktop",
        "Bosch dishwasher",
        "Plenty of cupboard storage",
      ],
      living: [
        "Open-plan living/dining on engineered timber floors",
        "Reverse-cycle split system air conditioning",
        "Private 8 sqm balcony",
      ],
      bedrooms: [
        "Master with built-in robe",
        "Second bedroom with built-in robe (currently tenant's home office)",
      ],
      outdoor: [
        "Common rooftop BBQ area",
        "Secure bike storage",
      ],
      climate: ["Daikin reverse-cycle split"],
      security: [
        "Secure intercom entry",
        "CCTV in common areas",
      ],
      smart: ["NBN FTTP available"],
    },
    schoolCatchment: {
      primary: "Newcastle East Public",
      secondary: "Newcastle High School",
      private: "Newcastle Grammar School",
    },
    transport: {
      metro: "Newcastle Interchange — 6-minute walk",
      bus: "Multiple routes on Hunter Street",
      shopping: "Marketown — 5-minute walk",
    },
    ownerNotes: [
      "Currently tenanted at $560/week on a fixed-term lease until November 2026.",
      "Tenants are a young professional couple — no issues, always pay on time.",
      "Strata is $890/quarter, council rates ~$1,400/year, water ~$1,000/year.",
      "Vendor is selling because they're consolidating their portfolio interstate.",
      "Net yield calculation assumes the buyer takes over the existing lease.",
    ],
    inspectionTimes: {
      upcoming: "Saturday 9:00 AM — Tenants will be present",
      note: "Investor inspections only — please respect the tenants",
    },
  },

  // ── 4. Rural acreage / lifestyle ──
  {
    id: "lot-47-dargan-valley-wollombi",
    slug: "lot-47-dargan-valley-wollombi",
    source: "curated",
    createdAt: NOW,
    address: "Lot 47 Dargan Valley Road, Wollombi NSW 2325",
    headline: "10-Acre Lifestyle Acreage in the Wollombi Valley",
    priceGuide: "$1,750,000 — $1,925,000",
    propertyType: "Acreage",
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 4,
    landSize: "10.2 acres (4.13 ha)",
    yearBuilt: 2015,
    agent: JAG_AGENT,
    features: {
      kitchen: [
        "Country-style kitchen with timber benchtops",
        "Smeg 900mm freestanding gas cooker",
        "Walk-in pantry",
        "Filtered rainwater on tap",
      ],
      living: [
        "Vaulted timber ceilings in main living",
        "Cast-iron Nectre wood heater",
        "Wraparound verandah with valley views",
      ],
      bedrooms: [
        "Master with ensuite, walk-in robe and private deck access",
        "3 additional bedrooms with built-ins",
      ],
      outdoor: [
        "Established veggie garden with chook run",
        "Two paddocks suitable for horses or alpacas",
        "Spring-fed dam plus 110,000 L rainwater tank",
        "Detached 4-bay machinery shed (powered)",
        "Olive grove (~40 trees) producing harvest each May",
      ],
      climate: [
        "Wood heater + ceiling fans",
        "Cool valley breezes year-round",
      ],
      security: [
        "Solar-powered electric front gate",
        "Rural intercom",
      ],
      smart: [
        "10kW solar with 13.5 kWh battery (Tesla Powerwall)",
        "Starlink internet installed",
      ],
    },
    schoolCatchment: {
      primary: "Wollombi Public School (4 km)",
      secondary: "Cessnock High School (school bus stops at front gate)",
      private: "Hunter Valley Grammar School (35-minute drive)",
    },
    transport: {
      metro: "No metro — 1 hour to Cessnock, 2 hours to Sydney CBD",
      bus: "School bus on Dargan Valley Road",
      shopping: "Wollombi village — 5-minute drive (general store, café, pub)",
    },
    ownerNotes: [
      "We're off-grid capable — solar + battery means we never lose power even in storms.",
      "The dam has never run dry in the 11 years we've been here.",
      "Internet via Starlink is genuinely fast — 200 Mbps consistent.",
      "Council DA already in for a second dwelling / studio if buyers want a granny flat.",
      "Vendor is downsizing to be closer to grandkids — genuine reason for sale.",
    ],
    inspectionTimes: {
      upcoming: "Saturday 1:00 PM — On-site inspection by appointment",
      note: "Allow 90 minutes — there's a lot to walk through",
    },
  },

  // ── 5. Off-the-plan tower ──
  {
    id: "residence-08-alta-epping",
    slug: "residence-08-alta-epping",
    source: "curated",
    createdAt: NOW,
    address: "Residence 08, Alta, 12 Cliff Road, Epping NSW 2121",
    headline: "Off-the-Plan Boutique Tower — Completion Late 2026",
    priceGuide: "$1,395,000",
    propertyType: "Off-the-plan",
    bedrooms: 2,
    bathrooms: 2,
    carSpaces: 1,
    landSize: "94 sqm internal + 12 sqm balcony",
    yearBuilt: 2026,
    agent: JAG_AGENT,
    features: {
      kitchen: [
        "Italian-imported Polyform cabinetry",
        "Bosch induction cooktop and pyrolytic oven",
        "Integrated Bosch dishwasher and microwave",
        "20mm engineered stone benchtops",
      ],
      living: [
        "Open-plan living with 2.7m ceilings",
        "Floor-to-ceiling double-glazed sliders to balcony",
        "Engineered oak floating floors",
      ],
      bedrooms: [
        "Master with mirrored built-in robe and ensuite",
        "Second bedroom with built-in robe — flex space for study or guest",
      ],
      outdoor: [
        "12 sqm covered balcony facing north-east",
        "Building amenities: rooftop terrace with BBQ pavilion, residents lounge, parcel concierge",
      ],
      climate: [
        "Reverse-cycle ducted air conditioning included",
        "Double-glazed acoustic windows",
      ],
      security: [
        "Video intercom",
        "Secure basement parking with EV-ready conduit",
        "CCTV in common areas",
      ],
      smart: [
        "Smart lock to apartment door",
        "Pre-wired for fibre internet",
      ],
    },
    schoolCatchment: {
      primary: "Epping Public School (700 m)",
      secondary: "Cheltenham Girls / Epping Boys High School",
      private: "Pymble Ladies' College, Knox Grammar (10-minute drive)",
    },
    transport: {
      metro: "Epping Metro Station — 4-minute walk",
      bus: "Multiple routes on Beecroft Road",
      shopping: "Coles Epping and Epping Marketplace — 6-minute walk",
    },
    ownerNotes: [
      "10% deposit on exchange, balance on settlement at completion (expected Q4 2026).",
      "Stamp duty is calculated on contract value at exchange — current NSW concessions may apply for first-home or investor.",
      "Developer has fixed-price contracts so no construction-cost surprises.",
      "Two display residences are completed and available for inspection on-site.",
      "FIRB approval pre-cleared for offshore buyers.",
    ],
    inspectionTimes: {
      upcoming: "Saturday 12:00 PM — Display suite open",
      note: "Off-the-plan — display suite shows finishes",
    },
  },
];

export function getCuratedProperty(id: string): Property | undefined {
  return CURATED_PROPERTIES.find((p) => p.id === id);
}

// Welcome message used to seed each per-property chat. Step 6 will replace this
// with a language-aware variant from i18n.ts.
export function buildWelcomeMessage(address: string): string {
  return `Welcome to your private viewing of **${address}**.\n\nI'm your AI Property Concierge. Ask me anything — from kitchen specs to school catchments. I'm here to help.`;
}

export function getPropertyContext(p: Property): string {
  const lines: string[] = [];
  lines.push("PROPERTY LISTING — CONFIDENTIAL AGENT BRIEF");
  lines.push("=============================================");
  lines.push(`Address: ${p.address}`);
  lines.push(`Headline: ${p.headline}`);
  lines.push(`Price Guide: ${p.priceGuide}`);
  lines.push(`Type: ${p.propertyType}`);
  lines.push(
    `Bedrooms: ${p.bedrooms} | Bathrooms: ${p.bathrooms} | Car Spaces: ${p.carSpaces}`
  );
  if (p.landSize) lines.push(`Land Size: ${p.landSize}`);
  if (p.yearBuilt) lines.push(`Built: ${p.yearBuilt}`);

  if (p.features) {
    lines.push("");
    lines.push("KITCHEN:");
    p.features.kitchen.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("LIVING AREAS:");
    p.features.living.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("BEDROOMS:");
    p.features.bedrooms.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("OUTDOOR:");
    p.features.outdoor.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("CLIMATE CONTROL:");
    p.features.climate.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("SECURITY:");
    p.features.security.forEach((f) => lines.push(`• ${f}`));
    lines.push("");
    lines.push("SMART HOME:");
    p.features.smart.forEach((f) => lines.push(`• ${f}`));
  }

  if (p.schoolCatchment) {
    lines.push("");
    lines.push("SCHOOL CATCHMENT:");
    if (p.schoolCatchment.primary)
      lines.push(`• Primary: ${p.schoolCatchment.primary}`);
    if (p.schoolCatchment.secondary)
      lines.push(`• Secondary: ${p.schoolCatchment.secondary}`);
    if (p.schoolCatchment.private)
      lines.push(`• Private: ${p.schoolCatchment.private}`);
    if (p.schoolCatchment.earlyChildhood)
      lines.push(`• Early Childhood: ${p.schoolCatchment.earlyChildhood}`);
  }

  if (p.transport) {
    lines.push("");
    lines.push("TRANSPORT & AMENITIES:");
    if (p.transport.metro) lines.push(`• Metro: ${p.transport.metro}`);
    if (p.transport.bus) lines.push(`• Bus: ${p.transport.bus}`);
    if (p.transport.shopping)
      lines.push(`• Shopping: ${p.transport.shopping}`);
  }

  if (p.ownerNotes && p.ownerNotes.length > 0) {
    lines.push("");
    lines.push("OWNER'S PRIVATE NOTES (not publicly listed):");
    p.ownerNotes.forEach((n) => lines.push(`• ${n}`));
  }

  if (p.inspectionTimes) {
    lines.push("");
    lines.push("INSPECTION:");
    if (p.inspectionTimes.upcoming)
      lines.push(`• Next Open: ${p.inspectionTimes.upcoming}`);
    if (p.inspectionTimes.note) lines.push(`• ${p.inspectionTimes.note}`);
  }

  if (p.agent) {
    lines.push("");
    lines.push("AGENT:");
    lines.push(`${p.agent.name} — ${p.agent.agency}`);
    lines.push(`Mobile: ${p.agent.mobile} | Email: ${p.agent.email}`);
  }

  // For runtime-loaded properties (URL or manual), description is the whole knowledge base.
  if (p.description && !p.features) {
    lines.push("");
    lines.push("DESCRIPTION:");
    lines.push(p.description);
    if (p.sourceUrl) {
      lines.push("");
      lines.push(`SOURCE URL: ${p.sourceUrl}`);
    }
  }

  return lines.join("\n").trim();
}
