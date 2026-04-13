import { NextResponse } from "next/server";
import { getQuestionTrends, getConversionMetrics, getRecentQuestions } from "@/lib/analytics";
import { getLeads } from "@/lib/leads";

// No auth — demo limitation
export async function GET() {
  return NextResponse.json({
    leads: getLeads(),
    trends: getQuestionTrends(),
    metrics: getConversionMetrics(),
    recentQuestions: getRecentQuestions(),
  });
}
