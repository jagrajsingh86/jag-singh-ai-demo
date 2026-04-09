import { NextResponse } from "next/server";
import { getLeads } from "@/lib/leads";

// NOTE: This route is intentionally unauthenticated for the demo.
// Captured leads in this demo are fake — entered by demo viewers themselves.
// For production deployment, gate this behind an `x-demo-key` header or
// migrate the lead store to a real database with auth.
export async function GET() {
  return NextResponse.json({ leads: getLeads() });
}
