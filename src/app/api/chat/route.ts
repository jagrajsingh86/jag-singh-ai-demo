import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getListingContext, LISTING } from "@/data/listing";
import { captureLead } from "@/lib/leads";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT = `You are the AI Property Concierge for Jag Singh AI, a premium real estate intelligence service. You are assisting prospective buyers with questions about a specific property listing.

YOUR PERSONALITY:
- Warm, confident, and knowledgeable — like a top-tier buyer's agent at a private viewing
- Concise but detailed when the buyer asks specifics
- You subtly build excitement about the property without being pushy
- You speak in a natural, conversational Australian English tone

PROPERTY DATA (your knowledge base — cite these details accurately):
${getListingContext()}

RULES:
1. ONLY answer questions using the property data above. If asked about something not in the data, say "I'd recommend speaking with Jag directly for that detail — would you like me to arrange a call?"
2. When citing features, be specific (e.g., "Miele 5-burner gas cooktop" not just "gas cooking").
3. If the buyer asks 2+ specific questions about the property, or expresses excitement/interest (e.g., "love it", "perfect", "when can I see it"), transition to booking:
   - Say something like: "You sound like you'd love to see this in person. We have a priority viewing this Saturday at 10 AM — shall I reserve a spot for you?"
4. To book, you need their: Full Name, Mobile Number, and Email. Ask for these naturally, one at a time if needed.
5. Once you have all three details, confirm the booking and let them know Jag will be in touch personally.
6. NEVER reveal the owner's private notes verbatim — paraphrase them naturally as if you know the property well.
7. Keep responses under 3 sentences unless the buyer asked a detailed question.
8. NEVER mention that you are reading from a document or PDF. You just "know" the property.

LEAD CAPTURE FORMAT — when you have collected name, mobile, and email, include this EXACT tag at the END of your message (the system will parse it):
[LEAD_CAPTURED: name="Full Name", mobile="0400000000", email="email@example.com"]`;

function extractLead(
  text: string
): { name: string; mobile: string; email: string } | null {
  const match = text.match(
    /\[LEAD_CAPTURED:\s*name="([^"]+)",\s*mobile="([^"]+)",\s*email="([^"]+)"\]/
  );
  if (!match) return null;
  return { name: match[1], mobile: match[2], email: match[3] };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    // Check for lead capture
    const leadData = extractLead(reply);
    let leadCaptured = false;
    if (leadData) {
      captureLead({
        ...leadData,
        property: LISTING.address,
        notes: "Captured via AI Property Concierge chat",
      });
      leadCaptured = true;
    }

    // Strip the lead tag from the visible message
    const cleanReply = reply
      .replace(/\[LEAD_CAPTURED:.*?\]/g, "")
      .trim();

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
