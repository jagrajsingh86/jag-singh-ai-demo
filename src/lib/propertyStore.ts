import type { Property } from "./types";
import { getCuratedProperty } from "@/data/properties";

// Module-scope Map for runtime properties (URL-loaded + manual entry).
// Survives hot reloads in dev via globalThis trick (same pattern Prisma uses).
// On Vercel: per serverless instance — lost on cold start. Documented limitation.

declare global {
  // eslint-disable-next-line no-var
  var __propertyStore: Map<string, Property> | undefined;
}

const store: Map<string, Property> =
  globalThis.__propertyStore ?? new Map<string, Property>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__propertyStore = store;
}

export function registerProperty(property: Property): Property {
  store.set(property.id, property);
  return property;
}

export function getProperty(id: string): Property | undefined {
  // Runtime store takes precedence over curated (curated ids should never collide,
  // but if they do, the runtime entry wins).
  return store.get(id) ?? getCuratedProperty(id);
}

export function listRegisteredProperties(): Property[] {
  return Array.from(store.values());
}
