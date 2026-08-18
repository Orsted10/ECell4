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
  name: string;
  avatar: string;
  title: string;
  building: string;
  why: string;
  obsessed: string;
  stats: string;
  tags: string[];
  featured?: boolean;
  batch?: string;
  github?: string;
  linkedin?: string;
}

export const PEOPLE: Person[] = [
  // ── 1. FOUNDERS ────────────────────────────────────────────────
  {
    id: "founder-1",
    role: "FOUNDERS",
    name: "Siddharth Malhotra",
    avatar: "SM",
    title: "Founder & CEO @ DevGrid (YC W25)",
    building: "High-throughput cloud GPU orchestration for local LLM inference.",
    why: "E-Cell gave us our first $10k non-dilutive grant and 100 alpha users on day 4.",
    obsessed: "Sub-10ms latency inference & decentralized compute networks.",
    stats: "$450k Seed Raised · 14,000 Developers",
    tags: ["Distributed Systems", "Rust", "Nvidia Triton", "YC W25"],
    featured: true,
    batch: "FOUNDRY BATCH 02",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "founder-2",
    role: "FOUNDERS",
    name: "Pooja Deshmukh",
    avatar: "PD",
    title: "Co-Founder @ FleetTrack Logistics",
    building: "Automated telemetry & smart EV routing for intercity logistics fleets.",
    why: "Found my CTO during the 36-hour E-Cell Hack-Forge Hackathon.",
    obsessed: "Battery degradation modeling and edge IoT sensors.",
    stats: "32,000 Active Fleet Units · ₹1.8 Cr ARR",
    tags: ["IoT Hardware", "Golang", "TimeScaleDB", "Logistics"],
    featured: true,
    batch: "FOUNDRY BATCH 01",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "founder-3",
    role: "FOUNDERS",
    name: "Aryan Sen",
    avatar: "AS",
    title: "Founder @ AgentForge AI",
    building: "Enterprise multi-agent workflow orchestration for fintech underwriting.",
    why: "Mentorship from E-Cell alumni helped us close our first 3 enterprise pilots.",
    obsessed: "Autonomous AI reflection loops and structured outputs.",
    stats: "9 Enterprise Pilots · $120k ARR",
    tags: ["AI Agents", "Python", "LangGraph", "Supabase"],
    featured: true,
    batch: "FOUNDRY BATCH 03",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "founder-4",
    role: "FOUNDERS",
    name: "Kritika Jain",
    avatar: "KJ",
    title: "Founder @ MedSync Scribe",
    building: "Ambient clinical transcription AI tailored for Indian multilingual doctors.",
    why: "Tested the first prototype in the campus health center within 48 hours.",
    obsessed: "Acoustic noise cancellation in crowded outpatient clinics.",
    stats: "85 Active Clinics · 140,000 Transcripts",
    tags: ["Speech AI", "Next.js", "Whisper", "HealthTech"],
    featured: false,
    batch: "FOUNDRY BATCH 03",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "founder-5",
    role: "FOUNDERS",
    name: "Nikhil Aggarwal",
    avatar: "NA",
    title: "Co-Founder @ TerraWatt Decentralized Energy",
    building: "Peer-to-peer solar microgrid trading on high-throughput rollups.",
    why: "The only room on campus where people don't ask you for a resume — they ask for your GitHub commit history.",
    obsessed: "Smart grid load balancing and zero-knowledge micro-settlements.",
    stats: "4 Solar Microgrids · 1.2M kWh Traded",
    tags: ["CleanTech", "Solidity", "FastAPI", "Embedded Systems"],
    featured: false,
    batch: "FOUNDRY BATCH 02",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "founder-6",
    role: "FOUNDERS",
    name: "Sanjana Nair",
    avatar: "SN",
    title: "Founder @ OpenCanvas Studio",
    building: "High-performance collaborative WebGL shader canvas for creative coders.",
    why: "E-Cell connected me with mentors who taught me product-led organic growth.",
    obsessed: "GPU fragment shaders, WebGPU compute, and 120fps fluid rendering.",
    stats: "1.4M Open-Source Downloads · 4,800 Stars",
    tags: ["WebGL", "Three.js", "TypeScript", "Open Source"],
    featured: false,
    batch: "FOUNDRY BATCH 03",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },

  // ── 2. STUDENTS / BUILDERS ─────────────────────────────────────
  {
    id: "student-1",
    role: "STUDENTS",
    name: "Aarav Sharma",
    avatar: "AS",
    title: "3rd Year CSE · AI Systems Builder",
    building: "NeuroFlow — Automated autonomous research agent for bio-compounds.",
    why: "Where high-velocity hackers hang out after 8 PM.",
    obsessed: "Multi-modal model distillation and quantization on edge devices.",
    stats: "Winner @ Hack-Forge 2025 · 3 Pre-prints",
    tags: ["PyTorch", "CUDA", "FastAPI", "Research"],
    featured: true,
    batch: "COHORT 2026",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-2",
    role: "STUDENTS",
    name: "Diya Patel",
    avatar: "DP",
    title: "2nd Year IT · Frontend & Motion Engineer",
    building: "KineticUI — Micro-interaction and fluid physics library for web.",
    why: "I wanted to build interfaces that feel tactile and alive.",
    obsessed: "Spring physics, frame budgeting, and glassmorphic shaders.",
    stats: "12,000 npm Weekly Downloads",
    tags: ["Framer Motion", "TailwindCSS", "React 19", "UX"],
    featured: true,
    batch: "COHORT 2027",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-3",
    role: "STUDENTS",
    name: "Kabir Mehta",
    avatar: "KM",
    title: "4th Year CSE · Cloud Architect",
    building: "MeshRelay — Zero-config peer-to-peer developer tunneling.",
    why: "Because passive lectures can't teach you how to handle 50k req/sec.",
    obsessed: "QUIC protocol, eBPF network tracing, and WireGuard.",
    stats: "Used by 800+ Students Daily",
    tags: ["eBPF", "Rust", "Docker", "DevOps"],
    featured: false,
    batch: "COHORT 2025",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-4",
    role: "STUDENTS",
    name: "Ananya Roy",
    avatar: "AR",
    title: "3rd Year ECE · Autonomous Robotics",
    building: "Kavach EV — Vision-based collision avoidance for delivery rovers.",
    why: "Found multidisciplinary teammates across ME and CSE under one roof.",
    obsessed: "LiDAR SLAM algorithms and sub-50W compute efficiency.",
    stats: "2 Working Prototypes on Campus",
    tags: ["ROS 2", "OpenCV", "Embedded C++", "Robotics"],
    featured: false,
    batch: "COHORT 2026",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-5",
    role: "STUDENTS",
    name: "Rishi Gupta",
    avatar: "RG",
    title: "2nd Year Biotech · Bio-Informatics",
    building: "PulseLab — Real-time spectrophotometry for water contaminant tracing.",
    why: "E-Cell provided the lab prototyping space and seed funding.",
    obsessed: "Microfluidics and real-time spectrophotometric telemetry.",
    stats: "Published in IEEE BioSensors",
    tags: ["Python", "Sensors", "Data Science", "BioTech"],
    featured: false,
    batch: "COHORT 2027",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-6",
    role: "STUDENTS",
    name: "Meera Iyer",
    avatar: "MI",
    title: "3rd Year CSE · Cryptography & Zero-Knowledge",
    building: "ZKPledge — Decentralized credential verification without leaking PII.",
    why: "Collaborating with alumni working in top crypto research labs.",
    obsessed: "Circom circuits, Groth16 provers, and verifiable compute.",
    stats: "Best Privacy Hack @ EthIndia",
    tags: ["ZKP", "Circom", "Solidity", "Rust"],
    featured: false,
    batch: "COHORT 2026",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-7",
    role: "STUDENTS",
    name: "Devansh Singhania",
    avatar: "DS",
    title: "3rd Year BBA · Growth & Distribution",
    building: "CampusViral — Peer-to-peer distribution engine for collegiate brands.",
    why: "You learn more from spending ₹5,000 on real ad tests than 3 years of case studies.",
    obsessed: "Referral loops, CAC-to-LTV equations, and TikTok UGC hooks.",
    stats: "Generated ₹40L+ GMV for Student Brands",
    tags: ["Growth Marketing", "Analytics", "SEO", "Sales"],
    featured: false,
    batch: "COHORT 2026",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "student-8",
    role: "STUDENTS",
    name: "Tanvi Verma",
    avatar: "TV",
    title: "4th Year Design · Brand & Visual Identity",
    building: "FoundryDesign — Open-source aesthetic component kit for founders.",
    why: "Good software deserves world-class typography and taste.",
    obsessed: "Editorial micro-typography, brutalist minimalism, and 3D splines.",
    stats: "Designed 14 E-Cell Venture Brands",
    tags: ["Figma", "Branding", "Spline", "Design Systems"],
    featured: false,
    batch: "COHORT 2025",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },

  // ── 3. MENTORS ─────────────────────────────────────────────────
  {
    id: "mentor-1",
    role: "MENTORS",
    name: "Vikramaditya Bose",
    avatar: "VB",
    title: "VP of Engineering (Ex-Stripe / Swiggy)",
    building: "Mentoring student founders on building fault-tolerant infrastructure.",
    why: "Paying forward the guidance I received when I wrote my first line of code.",
    obsessed: "Distributed transaction correctness and 99.999% SLA architectures.",
    stats: "14 Years Industry Experience · 18 Startups Mentored",
    tags: ["System Architecture", "Scale", "Leadership", "Venture Advisor"],
    featured: true,
    batch: "MENTOR NETWORK",
    linkedin: "https://linkedin.com",
  },
  {
    id: "mentor-2",
    role: "MENTORS",
    name: "Dr. Preeti Saxena",
    avatar: "PS",
    title: "Principal AI Scientist @ NeuroLabs",
    building: "Advising deep-tech cohorts on neural architecture search & distillation.",
    why: "Student builders here move with unprecedented speed and conviction.",
    obsessed: "Transformer attention mechanisms and parameter-efficient fine tuning.",
    stats: "24 IEEE Patents · Ex-Google DeepMind Fellow",
    tags: ["Deep Learning", "LLM Alignment", "AI Governance"],
    featured: false,
    batch: "MENTOR NETWORK",
    linkedin: "https://linkedin.com",
  },
  {
    id: "mentor-3",
    role: "MENTORS",
    name: "Rahul Chadha",
    avatar: "RC",
    title: "General Partner @ Apex Ventures",
    building: "Evaluating early-stage campus ventures for pre-seed capital injection.",
    why: "The next decacorn founders are currently dorm room roommates at CU.",
    obsessed: "Unit economics, founder grit, and defensible moats.",
    stats: "Backed 22 Series-A Companies · $80M AUM",
    tags: ["Venture Capital", "Fundraising", "Term Sheets", "Angel Investor"],
    featured: true,
    batch: "VENTURE PARTNER",
    linkedin: "https://linkedin.com",
  },
  {
    id: "mentor-4",
    role: "MENTORS",
    name: "Sunita Rao",
    avatar: "SR",
    title: "Design Director @ Pentagram Studio",
    building: "Coaching product designers on building iconic, timeless design systems.",
    why: "Design is not decorative — it is the highest form of founder leverage.",
    obsessed: "Human-computer symbiosis and emotional ergonomics.",
    stats: "Red Dot Award Winner · 10+ Global Brand Systems",
    tags: ["Product Design", "Design Systems", "Brand Architecture"],
    featured: false,
    batch: "MENTOR NETWORK",
    linkedin: "https://linkedin.com",
  },
  {
    id: "mentor-5",
    role: "MENTORS",
    name: "Harsh Vardhan",
    avatar: "HV",
    title: "Head of Growth @ Scaler (Ex-Cred)",
    building: "Teaching zero-dollar guerrilla user acquisition & viral loops.",
    why: "I love helping hungry builders escape the 0-to-1 distribution death valley.",
    obsessed: "Product hooks, viral coefficient equations, and retention retention retention.",
    stats: "Scaled Products from 0 to 12M Active Users",
    tags: ["Growth Hacking", "Product Strategy", "Retention Loops"],
    featured: false,
    batch: "MENTOR NETWORK",
    linkedin: "https://linkedin.com",
  },

  // ── 4. ALUMNI ──────────────────────────────────────────────────
  {
    id: "alumni-1",
    role: "ALUMNI",
    name: "Gaurav Kapoor",
    avatar: "GK",
    title: "Founder @ OrbitPay (Acquired 2024)",
    building: "Angel investing in next-gen fintech and autonomous payment rails.",
    why: "Started OrbitPay in the E-Cell basement in 2021. Best decision of my life.",
    obsessed: "Cross-border instant settlements and programmable escrow.",
    stats: "$8.4M Acquisition · 12 Angel Investments",
    tags: ["FinTech", "Acquisition", "Angel Investor", "CU Batch 2021"],
    featured: true,
    batch: "ALUMNI CIRCLE",
    linkedin: "https://linkedin.com",
  },
  {
    id: "alumni-2",
    role: "ALUMNI",
    name: "Simran Kaur",
    avatar: "SK",
    title: "Staff Research Engineer @ Anthropic",
    building: "Steerability & constitutional AI guardrails for frontier models.",
    why: "Learned the foundational discipline of shipping code daily at E-Cell.",
    obsessed: "Mechanistic interpretability in frontier language models.",
    stats: "Co-authored 6 Frontier AI Papers",
    tags: ["AI Safety", "Anthropic", "Research", "CU Batch 2020"],
    featured: false,
    batch: "ALUMNI CIRCLE",
    linkedin: "https://linkedin.com",
  },
  {
    id: "alumni-3",
    role: "ALUMNI",
    name: "Aditya Joshi",
    avatar: "AJ",
    title: "Staff Infrastructure Engineer @ Uber NYC",
    building: "Ultra-low latency geospatial dispatching across 10,000 cities.",
    why: "E-Cell was the testing ground where we crashed servers and rebuilt them better.",
    obsessed: "Zero-downtime distributed live migrations and consensus engines.",
    stats: "Architected systems serving 140M Riders",
    tags: ["Distributed Systems", "Go", "Kubernetes", "CU Batch 2019"],
    featured: false,
    batch: "ALUMNI CIRCLE",
    linkedin: "https://linkedin.com",
  },
  {
    id: "alumni-4",
    role: "ALUMNI",
    name: "Neha Singhal",
    avatar: "NS",
    title: "Principal @ Elevation Capital",
    building: "Investing in B2B SaaS, developer tools, and vertical AI.",
    why: "Still source our sharpest campus founders directly from Chandigarh University.",
    obsessed: "Developer productivity tools and generational infrastructure shifts.",
    stats: "$40M Deployed across 8 Seed Deals",
    tags: ["Venture Capital", "B2B SaaS", "Investing", "CU Batch 2018"],
    featured: false,
    batch: "ALUMNI CIRCLE",
    linkedin: "https://linkedin.com",
  },
  {
    id: "alumni-5",
    role: "ALUMNI",
    name: "Karan Bedi",
    avatar: "KB",
    title: "Co-Founder & COO @ SwiftLog (Series B)",
    building: "Automated warehouse robotics and end-to-end middle-mile logistics.",
    why: "The alumni network is a lifelong founder brotherhood.",
    obsessed: "Robotic picking throughput and warehouse square-foot efficiency.",
    stats: "$24M Series B · 450+ Team Members",
    tags: ["Robotics", "Supply Chain", "Scale", "CU Batch 2019"],
    featured: false,
    batch: "ALUMNI CIRCLE",
    linkedin: "https://linkedin.com",
  },

  // ── 5. FACULTY ─────────────────────────────────────────────────
  {
    id: "faculty-1",
    role: "FACULTY",
    name: "Dr. Alok Verma",
    avatar: "AV",
    title: "Director of Tech Transfer & Incubation",
    building: "Institutional capital access, patent grants, and IP commercialization.",
    why: "Transforming student thesis papers into commercialized global ventures.",
    obsessed: "Non-dilutive government research grants and university patents.",
    stats: "38 Patents Granted · ₹12 Cr Grant Pool",
    tags: ["IP Law", "Incubation", "Govt Grants", "Tech Transfer"],
    featured: true,
    batch: "FACULTY BOARD",
    linkedin: "https://linkedin.com",
  },
  {
    id: "faculty-2",
    role: "FACULTY",
    name: "Prof. Rajiv Chopra",
    avatar: "RC",
    title: "Head of Entrepreneurship & Venture Development",
    building: "Designing zero-red-tape fast-track academic credits for founders.",
    why: "Students who build real companies shouldn't be penalized by attendance sheets.",
    obsessed: "Venture-based curriculum and hands-on founder labs.",
    stats: "Founded CU Innovation Accelerator",
    tags: ["Venture Pedagogy", "Incubation", "Academic Policy"],
    featured: false,
    batch: "FACULTY BOARD",
    linkedin: "https://linkedin.com",
  },
  {
    id: "faculty-3",
    role: "FACULTY",
    name: "Dr. Shalini Mittal",
    avatar: "SM",
    title: "Dean of Deep-Tech Research & Computing",
    building: "Providing high-performance GPU server clusters for student founders.",
    why: "World-class compute infrastructure belongs in the hands of hungry students.",
    obsessed: "GPU virtualization and quantum simulation algorithms.",
    stats: "Directs 128x H100 GPU Cluster",
    tags: ["HPC", "Quantum Computing", "Deep-Tech"],
    featured: false,
    batch: "FACULTY BOARD",
    linkedin: "https://linkedin.com",
  },
  {
    id: "faculty-4",
    role: "FACULTY",
    name: "Prof. Manmohan Singh",
    avatar: "MS",
    title: "Lead Legal Advisor & Entity Incorporation",
    building: "Free legal incorporation and term sheet review for student startups.",
    why: "Protecting first-time founders from predatory term sheets and equity dilution.",
    obsessed: "Cap-table governance, founder vesting, and SAFE agreements.",
    stats: "Incorporated 120+ Campus Startups",
    tags: ["Corporate Law", "Cap Tables", "SAFE Notes"],
    featured: false,
    batch: "FACULTY BOARD",
    linkedin: "https://linkedin.com",
  },

  // ── 6. PARTNERS ────────────────────────────────────────────────
  {
    id: "partner-1",
    role: "PARTNERS",
    name: "Google Cloud for Startups",
    avatar: "GC",
    title: "Global Cloud & AI Compute Partner",
    building: "Providing up to $200,000 in Google Cloud compute credits & Vertex AI.",
    why: "Backing the next generation of AI-native collegiate startups.",
    obsessed: "TPU v5e clusters and enterprise foundation models.",
    stats: "$200K Credits per Cohort · 1:1 GCP Architect Hours",
    tags: ["Google Cloud", "Vertex AI", "Compute Credits", "Global Partner"],
    featured: true,
    batch: "INSTITUTIONAL PARTNER",
    linkedin: "https://linkedin.com",
  },
  {
    id: "partner-2",
    role: "PARTNERS",
    name: "Nvidia Inception & AWS",
    avatar: "NV",
    title: "Deep-Tech Hardware & Infrastructure Partner",
    building: "Dedicated DGX compute access, TensorRT optimization, and AWS Activate.",
    why: "Empowering university researchers to ship production AI models.",
    obsessed: "CUDA kernel acceleration and low-precision FP8 inference.",
    stats: "Direct Inception Program Admission for E-Cell Startups",
    tags: ["Nvidia", "AWS Activate", "Hardware Compute", "Deep-Tech"],
    featured: false,
    batch: "INSTITUTIONAL PARTNER",
    linkedin: "https://linkedin.com",
  },
  {
    id: "partner-3",
    role: "PARTNERS",
    name: "Peak XV Spark & YC Fellowship",
    avatar: "PX",
    title: "Venture Accelerator Feeder & Syndicate",
    building: "Fast-track partner pitch sessions and pre-seed investment pipeline.",
    why: "Direct pipeline connecting CU founders to Tier-1 global venture capital.",
    obsessed: "High-conviction student founders with extreme execution speed.",
    stats: "Fast-Track Partner Pitching for Top 5 Cohort Startups",
    tags: ["Peak XV", "YC", "Angel Syndicate", "Venture Partner"],
    featured: true,
    batch: "VENTURE SYNDICATE",
    linkedin: "https://linkedin.com",
  },
];

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
