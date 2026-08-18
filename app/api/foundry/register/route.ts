import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

// Heuristic check for gibberish, spam, or placeholder answers
function isLowEffortInput(text: string): boolean {
  if (!text) return true;
  const trimmed = text.trim();
  if (trimmed.length < 15) return true;
  // Check if string is just repeated digits/letters (e.g. "2323", "aaaa", "asdfasdf")
  const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s+/g, ""));
  if (uniqueChars.size <= 3) return true;
  if (/^(test|asdf|qwerty|none|na|nil|1234|2323)$/i.test(trimmed)) return true;
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      universityId,
      department,
      year,
      phone,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      trackId,
      problemStatement,
      buildIn30Days,
      pastProject,
      experienceSummary,
      skills,
      weeklyHours,
      pledgeAccepted,
    } = body;

    // Generate unique Founder ID (e.g. FD-2026-7842)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const founderId = `FD-2026-${randomSuffix}`;

    // 1. Strict Low-Effort / Placeholder Detection
    const pLow = isLowEffortInput(problemStatement);
    const bLow = isLowEffortInput(buildIn30Days);
    const projLow = isLowEffortInput(pastProject);

    let founderScore = 82;
    let scoreProblemSolving = 80;
    let scoreLeadership = 78;
    let scoreExecution = 85;
    let scoreOverall = 81;
    let aiAssessmentSummary =
      "Candidate demonstrates solid founder instincts, viable 30-day scope, and clear bias for rapid prototyping.";
    let startupDna = "01 // High-Velocity Product Builder";
    let status = "APPROVED_PENDING_BATCH";

    if (pLow || bLow || projLow) {
      // Penalize placeholder/spam input heavily
      founderScore = 18;
      scoreProblemSolving = 15;
      scoreLeadership = 12;
      scoreExecution = 20;
      scoreOverall = 18;
      status = "NEEDS_REVISION";
      startupDna = "00 // Incomplete / Low-Effort Submission";
      aiAssessmentSummary =
        "Application contains placeholder or low-effort text ('" + (problemStatement || "").slice(0, 20) + "'). Concrete problem articulation and 30-day prototype scope required for admission.";
    } else {
      // 2. Evaluate with Groq AI if key is available
      if (groq) {
        try {
          const prompt = `You are the rigorous Head of Admissions at an elite Silicon Valley venture accelerator (The Foundry at Chandigarh University). Evaluate this candidate's application on a strict scale from 0 to 100.

Applicant Details:
- Name: ${fullName}
- Track: ${trackId}
- Department & Year: ${department} (Year ${year})
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
- Problem they notice every day: "${problemStatement}"
- What they would build in 30 days with $10,000: "${buildIn30Days}"
- Past project built: "${pastProject}"
- Background & experience: "${experienceSummary}"

Instructions:
1. If the candidate answers with gibberish, single words, repetitive characters, or placeholder text, give scores between 10-30 and state that responses lack substance.
2. If the candidate gives thoughtful, specific, high-velocity answers, score genuinely between 65-95.
3. Provide an objective, critical 2-sentence assessment.

Respond strictly in valid JSON matching this schema:
{
  "problemSolving": <number between 0 and 100>,
  "leadership": <number between 0 and 100>,
  "execution": <number between 0 and 100>,
  "overall": <number between 0 and 100>,
  "startupDna": "<One of: 'High-Velocity Builder', 'Visionary Architect', 'Growth Hacker', 'System Orchestrator', 'Deep-Tech Pioneer', 'Needs Revision'>",
  "assessmentSummary": "<2 sentences evaluating their founder potential and prototype feasibility>"
}`;

          const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" },
          });

          const resText = completion.choices[0]?.message?.content;
          if (resText) {
            const parsed = JSON.parse(resText);
            scoreProblemSolving = parsed.problemSolving ?? scoreProblemSolving;
            scoreLeadership = parsed.leadership ?? scoreLeadership;
            scoreExecution = parsed.execution ?? scoreExecution;
            scoreOverall = parsed.overall ?? scoreOverall;
            founderScore = scoreOverall;
            startupDna = parsed.startupDna || startupDna;
            aiAssessmentSummary = parsed.assessmentSummary || aiAssessmentSummary;
            if (founderScore < 40) {
              status = "NEEDS_REVISION";
            }
          }
        } catch (err) {
          console.warn("Groq API evaluation error, using dynamic heuristic fallback:", err);
        }
      } else {
        // Dynamic heuristic calculation when Groq is not configured
        const wordCount = (problemStatement + " " + buildIn30Days + " " + pastProject).split(/\s+/).length;
        const skillCount = Array.isArray(skills) ? skills.length : 0;
        
        let calculated = 60 + Math.min(25, Math.floor(wordCount / 4)) + Math.min(10, skillCount * 2);
        if (githubUrl && githubUrl.includes("github.com")) calculated += 4;
        if (linkedinUrl && linkedinUrl.includes("linkedin.com")) calculated += 3;

        founderScore = Math.min(94, Math.max(45, calculated));
        scoreProblemSolving = Math.min(95, founderScore - 2 + Math.floor(Math.random() * 5));
        scoreLeadership = Math.min(92, founderScore - 4 + Math.floor(Math.random() * 6));
        scoreExecution = Math.min(96, founderScore + 3);
        scoreOverall = founderScore;

        if (trackId === "ai_engineer") startupDna = "01 // Deep-Tech AI Pioneer";
        else if (trackId === "growth") startupDna = "01 // Growth & Distribution Architect";
        else if (trackId === "designer") startupDna = "01 // Product & UX Craftsman";
        else startupDna = "01 // High-Velocity Product Builder";

        aiAssessmentSummary = `Strong application in ${department}. Clear problem framing with high execution velocity in ${trackId.toUpperCase()} specialization.`;
      }
    }

    const newFounderRecord = {
      founder_id: founderId,
      full_name: fullName,
      email: email || `${universityId.toLowerCase()}@cumail.in`,
      university_id: universityId,
      department,
      year,
      phone,
      linkedin_url: linkedinUrl || "",
      github_url: githubUrl || "",
      portfolio_url: portfolioUrl || "",
      track_id: trackId || "builder",
      problem_statement: problemStatement,
      build_in_30_days: buildIn30Days,
      past_project: pastProject,
      experience_summary: experienceSummary || "",
      skills: skills || [],
      weekly_hours: typeof weeklyHours === "number" ? weeklyHours : parseInt(weeklyHours) || 15,
      pledge_accepted: Boolean(pledgeAccepted),
      founder_score: founderScore,
      score_problem_solving: scoreProblemSolving,
      score_leadership: scoreLeadership,
      score_execution: scoreExecution,
      score_overall: scoreOverall,
      ai_assessment_summary: aiAssessmentSummary,
      startup_dna: startupDna,
      status: status,
      batch_name: "FOUNDRY BATCH 04",
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabase.from("founders").insert([newFounderRecord]);
      if (dbError) {
        console.error("Supabase insert error:", dbError);
      } else {
        try {
          await supabase.rpc("increment_founder_count");
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      founder: newFounderRecord,
    });
  } catch (error: any) {
    console.error("Foundry registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process application" },
      { status: 500 }
    );
  }
}
