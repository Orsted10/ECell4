import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { extractKeywords } from "@/lib/ideaEngine";

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

export async function POST(req: Request) {
  try {
    const { problem } = await req.json();
    if (!problem || typeof problem !== "string") {
      return NextResponse.json({ error: "Problem description required" }, { status: 400 });
    }

    const trimmed = problem.trim();
    const kw = extractKeywords(trimmed);
    const mainTopic = kw[0] || "this problem";

    // If Groq is available, generate bespoke, sharp, high-conviction startup breakdown
    if (groq) {
      try {
        const prompt = `You are a Silicon Valley startup accelerator partner (like Y Combinator). A collegiate founder has submitted this problem:
"${trimmed}"

Generate an intense, sharp, high-velocity 6-stage transformation breakdown.

Respond strictly in valid JSON matching this schema:
{
  "stages": [
    {
      "key": "problem",
      "label": "THE CORE FRICTION",
      "prompt": "WHY DOES THIS HURT?",
      "text": "<2 punchy sentences on the real, painful daily friction and who suffers from it>"
    },
    {
      "key": "exists",
      "label": "THE CURRENT WORKAROUND",
      "prompt": "WHAT SUCKS TODAY?",
      "text": "<1-2 sentences on why current legacy solutions or spreadsheets fail>"
    },
    {
      "key": "prototype",
      "label": "THE 30-DAY MVP",
      "prompt": "WHAT DO YOU SHIP FIRST?",
      "text": "<Specific, scrappy prototype you build in 4 weeks to test user demand>"
    },
    {
      "key": "advantage",
      "label": "UNFAIR ADVANTAGE",
      "prompt": "WHY A STUDENT FOUNDER WINS",
      "text": "<Why university distribution, agile iteration, and deep insider context win this market>"
    },
    {
      "key": "pitch",
      "label": "THE KILLER PITCH",
      "prompt": "THE ONE-LINER",
      "text": "<A memorable, high-converting one-sentence elevator pitch>"
    },
    {
      "key": "launch",
      "label": "FIRST 100 USERS",
      "prompt": "THE LAUNCH LOOP",
      "text": "<Tactical, zero-dollar guerrilla growth action to get the first 100 active users>"
    }
  ]
}`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          temperature: 0.4,
          response_format: { type: "json_object" },
        });

        const resText = completion.choices[0]?.message?.content;
        if (resText) {
          const parsed = JSON.parse(resText);
          if (Array.isArray(parsed.stages) && parsed.stages.length > 0) {
            return NextResponse.json({ success: true, stages: parsed.stages });
          }
        }
      } catch (err) {
        console.warn("Groq Idea Engine fallback triggered:", err);
      }
    }

    // High-fidelity fallback if no Groq key configured
    const fallbackStages = [
      {
        key: "problem",
        label: "THE CORE FRICTION",
        prompt: "WHY DOES THIS HURT?",
        text: `“${kw.join(" + ") || trimmed}” wastes hours of human focus every single week because legacy tools were built for compliance, not speed.`,
      },
      {
        key: "exists",
        label: "THE CURRENT WORKAROUND",
        prompt: "WHAT SUCKS TODAY?",
        text: `Band-aids, WhatsApp groups, messy spreadsheets, and manual back-and-forth. People accept the pain only because no one built the obvious fix.`,
      },
      {
        key: "prototype",
        label: "THE 30-DAY MVP",
        prompt: "WHAT DO YOU SHIP FIRST?",
        text: `One hyper-focused web tool solving just the single most frustrating bottleneck. Deployed in 7 days, zero fluff, instant utility.`,
      },
      {
        key: "advantage",
        label: "UNFAIR ADVANTAGE",
        prompt: "WHY A STUDENT FOUNDER WINS",
        text: `Zero legacy overhead. Unmatched speed. Direct, unmoderated access to thousands of daily campus users for rapid feedback loops.`,
      },
      {
        key: "pitch",
        label: "THE KILLER PITCH",
        prompt: "THE ONE-LINER",
        text: `The high-velocity operating engine that turns ${mainTopic} into a 30-second automated workflow.`,
      },
      {
        key: "launch",
        label: "FIRST 100 USERS",
        prompt: "THE LAUNCH LOOP",
        text: `Directly onboard 10 power users in 48 hours. Watch them use it over their shoulder, eliminate every friction point, and trigger viral peer referral.`,
      },
    ];

    return NextResponse.json({ success: true, stages: fallbackStages });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process idea" },
      { status: 500 }
    );
  }
}
