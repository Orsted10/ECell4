/* ────────────────────────────────────────────────────────────────
   E-CELL CU-UP — CONTENT LAYER
   Everything data-driven so a CMS (Sanity/Supabase/Strapi/custom API)
   can replace this file later without touching components.

   ⚠️ CONTENT INTEGRITY
   No real-world facts are invented. Anything that will eventually be
   real data (people, events, projects, stats, links) is either
   "[CONTENT REQUIRED]" or clearly tagged "(SAMPLE)".
   ──────────────────────────────────────────────────────────────── */

export const SITE = {
  name: "E-CELL",
  university: "CHANDIGARH UNIVERSITY",
  campus: "UTTAR PRADESH",
  tagline: "A place to start.",
  // Replace with the official domain when live.
  url: "https://ecell-cuup.example",
  email: "[CONTENT REQUIRED]",
  // Path to the official logo asset once provided (SVG/PNG in /public).
  // Keep null to use the built-in typographic wordmark.
  logoAsset: null as string | null,
  socials: [
    { label: "Instagram", href: "[CONTENT REQUIRED]" },
    { label: "LinkedIn", href: "[CONTENT REQUIRED]" },
    { label: "X / Twitter", href: "[CONTENT REQUIRED]" },
    { label: "YouTube", href: "[CONTENT REQUIRED]" },
  ],
};

export const NAV_SECTIONS = [
  { id: "enter", n: "00", label: "ENTER" },
  { id: "what-is", n: "01", label: "WHAT IS E-CELL" },
  { id: "journey", n: "02", label: "THE JOURNEY" },
  { id: "failure", n: "03", label: "THINGS THAT DIDN'T WORK" },
  { id: "ecosystem", n: "04", label: "THE ECOSYSTEM" },
  { id: "idea-machine", n: "05", label: "THE IDEA MACHINE" },
  { id: "made-here", n: "06", label: "MADE HERE" },
  { id: "events", n: "07", label: "CALENDAR OF POSSIBILITY" },
  { id: "manifesto", n: "08", label: "THE MANIFESTO" },
  { id: "your-path", n: "09", label: "FIND YOUR PATH" },
  { id: "start", n: "10", label: "START SOMETHING" },
];

export const INTRO_WORDS = ["IDEA", "QUESTION", "BUILD"] as const;

/* ── THE JOURNEY — 10 stages of the entrepreneurial lifecycle ── */
export const JOURNEY_STAGES = [
  {
    n: "01",
    title: "WONDER",
    words: ["curiosity", "a what-if", "something nags at you"],
    text: "It starts as a feeling. Something is wrong, or missing, or could simply be better. You don't know what it is yet. You just know it's there.",
  },
  {
    n: "02",
    title: "QUESTION",
    words: ["why?", "what if?", "why not?"],
    text: "The feeling becomes a question. You start asking it out loud. Questions are the first raw material of everything built after this.",
  },
  {
    n: "03",
    title: "DISCOVER",
    words: ["research", "talk to people", "find the edge"],
    text: "You go looking. You talk to the people who live with the problem. You read, you watch, you notice what everyone else walks past.",
  },
  {
    n: "04",
    title: "BUILD",
    words: ["prototype", "first ugly version", "ship it"],
    text: "You build the thing. It will be rough. It will be small. Small is how everything that matters has ever started.",
  },
  {
    n: "05",
    title: "BREAK",
    words: ["it fails", "it breaks", "that's the point"],
    text: "It breaks. It will. Nobody shows you this part. The prototype fails, the assumption falls apart, the pitch gets rejected.",
  },
  {
    n: "06",
    title: "PIVOT",
    words: ["read the data", "change direction", "keep going"],
    text: "Failure is data. You read it, you adjust, you change direction without changing why you started. The path bends. It does not end.",
  },
  {
    n: "07",
    title: "FIND PEOPLE",
    words: ["a co-founder", "a team", "your people"],
    text: "One idea becomes many hands. You find people who believe the same impossible thing. A team is a question that agreed to become a company.",
  },
  {
    n: "08",
    title: "LAUNCH",
    words: ["release", "tell the world", "start"],
    text: "You put it out there. Not when it's perfect — when it exists. Launching is a sentence, not a conclusion.",
  },
  {
    n: "09",
    title: "GROW",
    words: ["users", "iteration", "momentum"],
    text: "It compounds. Every user, every loop, every small win. Growth is what a decision looks like when repeated for long enough.",
  },
  {
    n: "10",
    title: "IMPACT",
    words: ["something changed", "someone's life", "a new normal"],
    text: "The question you asked in stage one now answers other people's questions. One dot became a line, a network, an ecosystem, a movement.",
  },
] as const;

/* ── WHAT IS E-CELL — the denial sequence ───────────────────── */
export const WHAT_IS_NOT = [
  "It's not a classroom.",
  "It's not another club.",
  "It's not a competition.",
  "It's not just events.",
] as const;

export const ECOSYSTEM_WORDS = [
  "IDEAS",
  "PEOPLE",
  "MENTORS",
  "EXPERIMENTS",
  "FAILURES",
  "FOUNDERS",
  "OPPORTUNITIES",
  "IMPACT",
] as const;

/* ── THE MANIFESTO ──────────────────────────────────────────── */
export const MANIFESTO_LINES = [
  { text: "WE BELIEVE IDEAS ARE CHEAP.", drift: -40 },
  { text: "ATTENTION IS RARE.", drift: 30 },
  { text: "BUILDING IS HARD.", drift: -20 },
  { text: "FAILURE IS DATA.", drift: 60 },
  { text: "PEOPLE MATTER.", drift: -50 },
  { text: "QUESTIONS MATTER.", drift: 25 },
  { text: "EXPERIMENTS MATTER.", drift: -30 },
  { text: "STARTING MATTERS.", drift: 45 },
] as const;

/* ── THE IDEA MACHINE ───────────────────────────────────────── */
export interface IdeaStage {
  key: string;
  label: string;
  prompt: string;
  // template receives the extracted keywords, e.g. ["transportation"]
  make: (kw: string[]) => string;
}

export const IDEA_STAGES: IdeaStage[] = [
  {
    key: "problem",
    label: "PROBLEM",
    prompt: "THE PROBLEM",
    make: (kw) => (kw[0] ? `“${kw.join(" + ")}” is harder than it should be.` : "[CONTENT REQUIRED]"),
  },
  {
    key: "who",
    label: "WHO?",
    prompt: "WHO EXPERIENCES IT?",
    make: (kw) => (kw[0] ? `People who live with ${kw[0]} every single day.` : "[CONTENT REQUIRED]"),
  },
  {
    key: "why",
    label: "WHY?",
    prompt: "WHY DOES IT EXIST?",
    make: () => "Because nobody has made the obvious fix obvious enough. Yet.",
  },
  {
    key: "exists",
    label: "TODAY",
    prompt: "WHAT EXISTS TODAY?",
    make: () => "Workarounds. Band-aids. Long email chains. A gap someone walks past daily.",
  },
  {
    key: "change",
    label: "CHANGE",
    prompt: "WHAT COULD CHANGE?",
    make: (kw) => (kw[0] ? `If ${kw[0]} became ten minutes easier for ten thousand people — that is a company.` : "[CONTENT REQUIRED]"),
  },
  {
    key: "idea",
    label: "IDEA",
    prompt: "THE IDEA",
    make: (kw) => (kw[0] ? `A small tool that makes ${kw[0]} radically simpler.` : "[CONTENT REQUIRED]"),
  },
  {
    key: "prototype",
    label: "PROTOTYPE",
    prompt: "THE PROTOTYPE",
    make: () => "One ugly, honest version. Built this week. Not next month.",
  },
  {
    key: "pitch",
    label: "PITCH",
    prompt: "THE PITCH",
    make: () => "One sentence a stranger understands. One sentence that makes them ask 'wait — that exists?'",
  },
  {
    key: "team",
    label: "TEAM",
    prompt: "THE TEAM",
    make: () => "Find one person who believes it too. Two is a team. Two is enough to start.",
  },
  {
    key: "launch",
    label: "LAUNCH",
    prompt: "LAUNCH",
    make: () => "Ship it. Tell people. Let the world react. The machine hands you back your own idea — sharper.",
  },
];

/* ── FIND YOUR PATH ─────────────────────────────────────────── */
export const PATH_OPTIONS: { choice: string; path: string[] }[] = [
  {
    choice: "I HAVE AN IDEA.",
    path: ["IDEA LAB", "MENTOR", "BUILD PROGRAM", "PITCH NIGHT", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT TO BUILD.",
    path: ["BUILD PROGRAM", "PROTOTYPE NIGHT", "MADE HERE", "E-CELL COMMUNITY"],
  },
  {
    choice: "I NEED A TEAM.",
    path: ["HACKATHON", "FOUNDER MATCH", "PITCH NIGHT", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT A MENTOR.",
    path: ["MENTOR NETWORK", "FOUNDER'S ROOM", "OFFICE HOURS", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT TO LEARN.",
    path: ["WORKSHOPS", "RESOURCE LIBRARY", "FOUNDER STORIES", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT TO COMPETE.",
    path: ["HACKATHON", "PITCH NIGHT", "INCUBATION", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT TO MEET FOUNDERS.",
    path: ["FOUNDER STORIES", "NETWORK NIGHTS", "FOUNDER'S ROOM", "E-CELL COMMUNITY"],
  },
  {
    choice: "I WANT TO START SOMETHING.",
    path: ["IDEA MACHINE", "MENTOR", "BUILD PROGRAM", "LAUNCH", "E-CELL COMMUNITY"],
  },
];

/* ── THE ECOSYSTEM — people network ─────────────────────────── */
export const NETWORK_ROLES = [
  "STUDENTS",
  "FOUNDERS",
  "MENTORS",
  "ALUMNI",
  "FACULTY",
  "PARTNERS",
] as const;

export type NetworkRole = (typeof NETWORK_ROLES)[number];

export interface Person {
  id: string;
  role: NetworkRole;
  name: string; // clearly-labelled sample placeholder
  building: string;
  why: string;
  obsessed: string;
  featured?: boolean;
}

/* Clearly-labelled sample people — swap for real data via CMS. */
const ROLE_COUNTS: Record<NetworkRole, number> = {
  STUDENTS: 8,
  FOUNDERS: 6,
  MENTORS: 5,
  ALUMNI: 5,
  FACULTY: 4,
  PARTNERS: 3,
};

export const PEOPLE: Person[] = NETWORK_ROLES.flatMap((role, ri) => {
  const count = ROLE_COUNTS[role];
  return Array.from({ length: count }, (_, i) => ({
    id: `${role.toLowerCase()}-${i + 1}`,
    role,
    name: `${role.slice(0, -1)} ${String(i + 1).padStart(2, "0")} (SAMPLE)`,
    building: "[CONTENT REQUIRED]",
    why: "[CONTENT REQUIRED]",
    obsessed: "[CONTENT REQUIRED]",
    featured: ri === 0 && i < 3,
  }));
});

/* ── MADE HERE — projects ───────────────────────────────────── */
export interface Project {
  id: string;
  index: string;
  name: string;
  founders: string;
  problem: string;
  status: string;
  tech: string[];
  lesson: string;
}

export const PROJECTS: Project[] = [
  {
    id: "pr1",
    index: "01",
    name: "PROJECT 01 (SAMPLE)",
    founders: "[CONTENT REQUIRED]",
    problem: "[CONTENT REQUIRED]",
    status: "PROTOTYPE",
    tech: ["[CONTENT REQUIRED]"],
    lesson: "[CONTENT REQUIRED]",
  },
  {
    id: "pr2",
    index: "02",
    name: "PROJECT 02 (SAMPLE)",
    founders: "[CONTENT REQUIRED]",
    problem: "[CONTENT REQUIRED]",
    status: "IN PROGRAM",
    tech: ["[CONTENT REQUIRED]"],
    lesson: "[CONTENT REQUIRED]",
  },
  {
    id: "pr3",
    index: "03",
    name: "PROJECT 03 (SAMPLE)",
    founders: "[CONTENT REQUIRED]",
    problem: "[CONTENT REQUIRED]",
    status: "PITCHED",
    tech: ["[CONTENT REQUIRED]"],
    lesson: "[CONTENT REQUIRED]",
  },
  {
    id: "pr4",
    index: "04",
    name: "PROJECT 04 (SAMPLE)",
    founders: "[CONTENT REQUIRED]",
    problem: "[CONTENT REQUIRED]",
    status: "EARLY IDEA",
    tech: ["[CONTENT REQUIRED]"],
    lesson: "[CONTENT REQUIRED]",
  },
];

/* ── THINGS THAT DIDN'T WORK ────────────────────────────────── */
export const FAILURES = [
  {
    id: "f1",
    name: "FAILED PROTOTYPE (SAMPLE)",
    assumption: "[CONTENT REQUIRED]",
    broke: "[CONTENT REQUIRED]",
    changed: "[CONTENT REQUIRED]",
  },
  {
    id: "f2",
    name: "WRONG ASSUMPTION (SAMPLE)",
    assumption: "[CONTENT REQUIRED]",
    broke: "[CONTENT REQUIRED]",
    changed: "[CONTENT REQUIRED]",
  },
  {
    id: "f3",
    name: "REJECTED PITCH (SAMPLE)",
    assumption: "[CONTENT REQUIRED]",
    broke: "[CONTENT REQUIRED]",
    changed: "[CONTENT REQUIRED]",
  },
];

/* ── EVENTS — calendar of possibility ───────────────────────── */
export interface EcEvent {
  id: string;
  date: string; // display string
  name: string;
  type: string;
  location: string;
  status: "UPCOMING" | "PAST";
  desc: string;
}

export const EVENTS: EcEvent[] = [
  {
    id: "e1",
    date: "TBA (SAMPLE)",
    name: "FLAGSHIP EVENT (SAMPLE)",
    type: "NETWORKING",
    location: "CAMPUS — [CONTENT REQUIRED]",
    status: "UPCOMING",
    desc: "[CONTENT REQUIRED]",
  },
  {
    id: "e2",
    date: "TBA (SAMPLE)",
    name: "HACKATHON (SAMPLE)",
    type: "BUILD",
    location: "CAMPUS — [CONTENT REQUIRED]",
    status: "UPCOMING",
    desc: "[CONTENT REQUIRED]",
  },
  {
    id: "e3",
    date: "TBA (SAMPLE)",
    name: "PITCH NIGHT (SAMPLE)",
    type: "PITCH",
    location: "CAMPUS — [CONTENT REQUIRED]",
    status: "UPCOMING",
    desc: "[CONTENT REQUIRED]",
  },
  {
    id: "e4",
    date: "TBA (SAMPLE)",
    name: "FOUNDER TALK (SAMPLE)",
    type: "STORY",
    location: "CAMPUS — [CONTENT REQUIRED]",
    status: "PAST",
    desc: "[CONTENT REQUIRED]",
  },
];
