export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  property: string;
  capturedAt: string;
  source: "ai-chat";
  notes: string;
}

// In-memory lead store (simulates CRM / Google Sheet)
const leads: Lead[] = [];

export function captureLead(lead: Omit<Lead, "id" | "capturedAt" | "source">): Lead {
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    capturedAt: new Date().toISOString(),
    source: "ai-chat",
  };
  leads.push(newLead);
  console.log("\n🔔 LEAD CAPTURED →", JSON.stringify(newLead, null, 2));
  return newLead;
}

export function getLeads(): Lead[] {
  return [...leads];
}
