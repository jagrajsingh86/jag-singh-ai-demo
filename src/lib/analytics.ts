import type { QuestionLog, QuestionTrend, ConversionMetrics } from "@/lib/types";
import { getLeads } from "@/lib/leads";

const questions: QuestionLog[] = [];
let totalEnquiries = 0;
let inspectionsBooked = 0;

const CATEGORY_PATTERNS: [string, RegExp][] = [
  ["Kitchen & Cooking", /kitchen|cook|gas|oven|stove|appliance|bench/i],
  ["Schools & Education", /school|catchment|education|childcare|college/i],
  ["Outdoor & Pool", /outdoor|pool|garden|backyard|bbq|alfresco|yard/i],
  ["Price & Value", /price|cost|value|worth|afford|guide|market/i],
  ["Transport & Location", /transport|metro|bus|train|station|drive|walk|commut/i],
  ["Bedrooms & Layout", /bedroom|bed|room|layout|floor\s?plan|ensuite|bathroom/i],
  ["Security & Smart Home", /security|alarm|camera|smart|automation|lock/i],
  ["Climate & Energy", /air\s?con|heating|cool|energy|solar|insulation|climate/i],
  ["Parking & Storage", /park|garage|car\s?space|storage|shed/i],
  ["Inspection & Viewing", /inspect|view|open\s?home|visit|see\s?(it|the)/i],
];

function categorise(question: string): string {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(question)) return category;
  }
  return "General Enquiry";
}

export function logQuestion(propertyId: string, propertyAddress: string, question: string): void {
  totalEnquiries++;
  questions.push({
    id: crypto.randomUUID(),
    propertyId,
    propertyAddress,
    question,
    category: categorise(question),
    timestamp: new Date().toISOString(),
  });
}

export function logInspectionBooked(): void {
  inspectionsBooked++;
}

export function getQuestionTrends(): QuestionTrend[] {
  const counts = new Map<string, number>();
  for (const q of questions) {
    counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
  }
  const total = questions.length || 1;
  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getConversionMetrics(): ConversionMetrics {
  const leadCount = getLeads().length;
  return {
    totalEnquiries,
    leadsCapured: leadCount,
    inspectionsBooked,
    conversionRate: totalEnquiries > 0 ? Math.round((leadCount / totalEnquiries) * 100) : 0,
  };
}

export function getRecentQuestions(limit = 20): QuestionLog[] {
  return questions.slice(-limit).reverse();
}
