import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getPropertyContext } from "@/data/properties";
import { getProperty } from "@/lib/propertyStore";
import { captureLead } from "@/lib/leads";
import { logQuestion, logInspectionBooked } from "@/lib/analytics";
import type { ChatMessage, Language, Property } from "@/lib/types";

// Lazy Groq client — instantiated on first use so the module can be imported
// without GROQ_API_KEY (e.g. during local dev structural testing).
let groqClient: Groq | null = null;
function getGroq(): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

type Mode = "solo" | "compare";

const BASE_PROMPT = `You are SENTINEL, the AI Property Concierge built by Jag Singh AI. You are a 24/7 lead qualification system for premium real estate agencies.

YOUR PERSONALITY:
- Warm, confident, and knowledgeable — like a top-tier buyer's agent at a private viewing
- Concise but detailed when the buyer asks specifics
- You subtly build excitement about the property without being pushy
- You speak in a natural, conversational tone

YOUR QUALIFICATION PROTOCOL (follow this sequence):
1. **ACKNOWLEDGE** — Instantly respond to every enquiry with warmth and specificity. Never give a generic "how can I help" — reference the property by name.
2. **RETRIEVE** — Answer their question with precise detail from the property data. Be specific ("Miele 5-burner gas cooktop" not "gas cooking").
3. **QUALIFY** — After 2+ exchanges, naturally ask qualifying questions:
   - Buyer Name (if not already given)
   - Intent: "Are you looking for a family home or an investment?"
   - Finance Status: "Have you been pre-approved or are you still exploring?"
4. **CONVERT** — Once qualified or if they express strong interest, transition to booking:
   - "You sound like you'd love to see this in person. We have a priority viewing this Saturday — shall I reserve a spot?"
   - Collect: Full Name, Mobile Number, and Email (ask naturally, one at a time if needed)
   - Confirm the booking and let them know the agent will be in touch personally.

RULES:
1. ONLY answer questions using the property data provided. If asked about something not in the data, say "I'd recommend speaking with the agent directly — would you like me to arrange that?"
2. NEVER reveal the owner's private notes verbatim — paraphrase them naturally as if you know the property well.
3. Keep responses under 3 sentences unless the buyer asked a detailed question.
4. NEVER mention that you are reading from a document, database, or PDF. You just "know" the property.
5. The lead capture tag format below MUST always stay in English even when responding in another language. Do not translate the tag, its keys, or its structure.

LEAD CAPTURE FORMAT — when you have collected name, mobile, and email, include this EXACT tag at the END of your message (the system will parse it):
[LEAD_CAPTURED: name="Full Name", mobile="0400000000", email="email@example.com"]`;

const SYSTEM_LANGUAGE_INSTRUCTION: Record<Language, string> = {
  en: "Respond in natural conversational Australian English.",
  zh: "请始终用简体中文回复。保持语气温暖、专业、自信。即使买家用英文提问，也要用中文回答。",
  hi: "कृपया हमेशा हिन्दी (देवनागरी लिपि) में जवाब दें। स्वर गर्म, पेशेवर और आत्मविश्वासपूर्ण रखें। यदि खरीदार अंग्रेज़ी में पूछता है, तब भी हिन्दी में जवाब दें।",
};

const COMPARE_INSTRUCTION =
  "This user is comparing properties side-by-side — focus on factual comparisons and let the buyer drive the conversation. Do not push for an inspection booking in this mode unless the buyer explicitly asks to book.";

function buildSystemPrompt(
  property: Property,
  language: Language,
  mode: Mode
): string {
  const parts = [
    BASE_PROMPT,
    "",
    "PROPERTY DATA (your knowledge base — cite these details accurately):",
    getPropertyContext(property),
    "",
    SYSTEM_LANGUAGE_INSTRUCTION[language] ?? SYSTEM_LANGUAGE_INSTRUCTION.en,
  ];
  if (mode === "compare") {
    parts.push("", COMPARE_INSTRUCTION);
  }
  return parts.join("\n");
}

function extractLead(
  text: string
): { name: string; mobile: string; email: string } | null {
  const match = text.match(
    /\[LEAD_CAPTURED:\s*name="([^"]+)",\s*mobile="([^"]+)",\s*email="([^"]+)"\]/
  );
  if (!match) return null;
  return { name: match[1], mobile: match[2], email: match[3] };
}

interface ChatRequestBody {
  messages: ChatMessage[];
  propertyId: string;
  language?: Language;
  mode?: Mode;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, propertyId } = body;
    const language: Language = body.language ?? "en";
    const mode: Mode = body.mode ?? "solo";

    if (!propertyId) {
      return NextResponse.json(
        { error: "missing_property_id" },
        { status: 400 }
      );
    }

    const property = getProperty(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "property_not_found" },
        { status: 404 }
      );
    }

    // Log the latest user question for analytics
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      logQuestion(propertyId, property.address, lastUserMsg.content);
    }

    const systemPrompt = buildSystemPrompt(property, language, mode);

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    const leadData = extractLead(reply);
    let leadCaptured = false;
    if (leadData) {
      captureLead({
        ...leadData,
        property: property.address,
        notes: "Captured via SENTINEL AI Concierge",
      });
      logInspectionBooked();
      leadCaptured = true;
    }

    const cleanReply = reply.replace(/\[LEAD_CAPTURED:.*?\]/g, "").trim();

    return NextResponse.json({
      message: cleanReply,
      leadCaptured,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
