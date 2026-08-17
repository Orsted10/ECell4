import { IDEA_STAGES, type IdeaStage } from "@/data/content";

/* ────────────────────────────────────────────────────────────────
   THE IDEA MACHINE CORE
   Deterministic for now. To connect an AI API later, replace the
   body of `transform` with a call to your model — it must return the
   same StageResult[] shape so the UI needs no changes.

   interface StageResult { label, prompt, text }
   ──────────────────────────────────────────────────────────────── */

export interface StageResult {
  key: string;
  label: string;
  prompt: string;
  text: string;
}

const STOPWORDS = new Set([
  "i","want","to","the","a","an","and","of","for","my","in","on","with",
  "about","improve","make","build","get","be","it","is","that","this",
  "there","are","at","by","from","so","but","or","we","you","they","can",
  "could","should","would","do","does","not","just","really","need","have",
  "has","very","more","than","then","every","day","all","people","some",
  "thing","things","someone","something","better","good","great","help",
  "helping","our","their","your","me","us","its","what","who","why","how",
]);

export function extractKeywords(input: string): string[] {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  const seen = new Set<string>();
  const uniq = words.filter((w) => {
    if (seen.has(w)) return false;
    seen.add(w);
    return true;
  });
  return uniq.sort((a, b) => b.length - a.length).slice(0, 3);
}

export function transform(input: string): StageResult[] {
  const kw = extractKeywords(input);

  // ── AI HOOK ──────────────────────────────────────────────────
  // If an LLM API is available:
  //   const res = await fetch("/api/idea-machine", { method: "POST", body: { problem: input } });
  //   return res.json();
  // ─────────────────────────────────────────────────────────────
  return IDEA_STAGES.map((s: IdeaStage) => ({
    key: s.key,
    label: s.label,
    prompt: s.prompt,
    text: s.make(kw),
  }));
}
