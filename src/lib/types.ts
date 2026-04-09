// Shared types for the demo app

export type PropertySource = "curated" | "url" | "manual";

export type Language = "en" | "zh" | "hi";

export type TabId = "portfolio" | "loadUrl" | "compare" | "leadInbox";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PropertyAgent {
  name: string;
  agency: string;
  mobile: string;
  email: string;
}

export interface PropertyFeatures {
  kitchen: string[];
  living: string[];
  bedrooms: string[];
  outdoor: string[];
  climate: string[];
  security: string[];
  smart: string[];
}

export interface PropertySchoolCatchment {
  primary?: string;
  secondary?: string;
  private?: string;
  earlyChildhood?: string;
}

export interface PropertyTransport {
  metro?: string;
  bus?: string;
  shopping?: string;
}

export interface PropertyInspection {
  upcoming?: string;
  note?: string;
}

export interface Property {
  // Identity
  id: string;
  slug: string;
  source: PropertySource;
  sourceUrl?: string;
  createdAt: string;

  // Headline / pricing
  address: string;
  headline: string;
  priceGuide: string;
  propertyType: string;

  // Specs
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landSize?: string;
  yearBuilt?: number;

  // Rich data — fully populated for curated, optional for runtime
  agent?: PropertyAgent;
  features?: PropertyFeatures;
  schoolCatchment?: PropertySchoolCatchment;
  transport?: PropertyTransport;
  ownerNotes?: string[];
  inspectionTimes?: PropertyInspection;

  // Used by URL/manual properties without structured features
  description?: string;
}
