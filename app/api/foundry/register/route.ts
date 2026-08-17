import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

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

    // Default heuristic scoring fallback
    let founderScore = 88;
    let scoreProblemSolving = 85;
    let scoreLeadership = 82;
    let scoreExecution = 92;
    let scoreOverall = 87;
    let aiAssessmentSummary =
      "Candidate demonstrates high bias for action, clear articulation of real-world friction, and pragmatic engineering execution.";
    let startupDna = "01 // High-Velocity Product Builder";

    // ── Evaluate via Groq API (LLaMA 3.3 70B Versatile) if key is provided ──
    if (groq) {
      try {
        const prompt = `You are the Head of Admissions at an elite Silicon Valley university startup accelerator (The Foundry). Evaluate this candidate's application and provide numerical scores (0-100) and an assessment.

Applicant Details:
- Name: ${fullName}
- Track: ${trackId}
- Department & Year: ${department} (Year ${year})
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
- Problem they notice every day: "${problemStatement}"
- What they would build in 30 days with $10,000: "${buildIn30Days}"
- Past project built: "${pastProject}"
- Background & experience: "${experienceSummary}"

Respond strictly with valid JSON conforming to this schema:
{
  "problemSolving": <number between 70 and 99>,
  "leadership": <number between 70 and 99>,
  "execution": <number between 70 and 99>,
  "overall": <number between 70 and 99>,
  "startupDna": "<One of: 'High-Velocity Builder', 'Visionary Architect', 'Growth Hacker', 'System Orchestrator', 'Deep-Tech Pioneer'>",
  "assessmentSummary": "<2 sentences evaluating their founder potential and bias for shipping>"
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
          scoreProblemSolving = parsed.problemSolving || scoreProblemSolving;
          scoreLeadership = parsed.leadership || scoreLeadership;
          scoreExecution = parsed.execution || scoreExecution;
          scoreOverall = parsed.overall || scoreOverall;
          founderScore = scoreOverall;
          startupDna = parsed.startupDna || startupDna;
          aiAssessmentSummary = parsed.assessmentSummary || aiAssessmentSummary;
        }
      } catch (err) {
        console.warn("Groq API evaluation fallback used:", err);
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
      weekly_hours: Number(weeklyHours) || 15,
      pledge_accepted: Boolean(pledgeAccepted),
      founder_score: founderScore,
      score_problem_solving: scoreProblemSolving,
      score_leadership: scoreLeadership,
      score_execution: scoreExecution,
      score_overall: scoreOverall,
      ai_assessment_summary: aiAssessmentSummary,
      startup_dna: startupDna,
      status: "APPROVED_PENDING_BATCH",
      batch_name: "FOUNDRY BATCH 04",
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      const { error: dbError } = await supabase.from("founders").insert([newFounderRecord]);
      if (dbError) {
        console.error("Supabase insert error:", dbError);
      } else {
        // Increment live community stats
        try {
          await supabase.rpc("increment_founder_count");
        } catch {
          // ignore if rpc not present
        }
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
