// Profile <-> scholarship matching engine.
//
// This is the foundation of the matching system: a transparent, rule-based
// scorer that computes how well a scholarship fits a student's profile, why,
// and whether they're even eligible. It's deterministic and free. An AI layer
// (e.g. semantic matching on essays/eligibility text) can be layered on top
// later by blending an extra signal into `score`.

import { parseTags, TAG_GROUPS } from "./scholarships";

export interface ProfileLike {
  gradeLevel?: string | null;
  intendedMajor?: string | null;
  householdIncome?: string | null;
  firstGen?: boolean | null;
  freeReducedLunch?: boolean | null;
  pellEligible?: boolean | null;
  ethnicity?: string | null;
  gender?: string | null;
  state?: string | null;
  activities?: string | null;
}

export interface ScholarshipLike {
  tags?: string | null;
  state?: string | null;
}

export interface MatchResult {
  score: number; // 0-100
  eligible: boolean; // false => the student doesn't qualify (hard restriction)
  reasons: string[]; // human-readable why-it-matches notes
}

const ETHNICITY_TAGS = TAG_GROUPS["Race & Ethnicity"];

// Map a free-text ethnicity to the canonical ethnicity tag(s) it implies.
const ETHNICITY_KEYWORDS: Record<string, string[]> = {
  "Black/African American": ["black", "african"],
  "Hispanic/Latino": ["hispanic", "latino", "latina", "latinx", "chicano", "mexican"],
  "Asian American": ["asian", "chinese", "korean", "japanese", "vietnamese", "filipino", "indian"],
  "Native American": ["native american", "indigenous", "american indian", "tribal"],
  "Pacific Islander": ["pacific islander", "hawaiian", "samoan", "polynesian"],
  "Middle Eastern/North African": ["middle eastern", "arab", "persian", "north african"],
  Multiracial: ["multiracial", "biracial", "mixed"],
};

function profileEthnicityTags(ethnicity: string | null | undefined): Set<string> {
  const out = new Set<string>();
  if (!ethnicity) return out;
  const e = ethnicity.toLowerCase();
  for (const [tag, kws] of Object.entries(ETHNICITY_KEYWORDS)) {
    if (kws.some((kw) => e.includes(kw))) out.add(tag);
  }
  return out;
}

function fieldTagForMajor(major: string | null | undefined): string | null {
  if (!major) return null;
  const m = major.toLowerCase();
  if (/(comput|engineer|science|math|technolog|data|bio|chem|physics)/.test(m)) return "STEM";
  if (/(art|music|theat|design|film|dance)/.test(m)) return "Arts";
  if (/(business|finance|account|econ|marketing|entrepre)/.test(m)) return "Business";
  if (/(history|english|literat|philosoph|writ|language|humanit)/.test(m)) return "Humanities";
  return null;
}

const lowIncome =
  (p: ProfileLike) =>
    p.pellEligible === true ||
    p.freeReducedLunch === true ||
    p.householdIncome === "Under $30k" ||
    p.householdIncome === "$30k–$60k";

export function computeMatch(profile: ProfileLike, s: ScholarshipLike): MatchResult {
  const tags = new Set(parseTags(s.tags));
  const reasons: string[] = [];
  let score = 0;
  let eligible = true;

  // --- Location ---
  if (s.state) {
    if (profile.state && profile.state === s.state) {
      score += 25;
      reasons.push(`For ${s.state} students (your state)`);
    } else if (profile.state && profile.state !== s.state) {
      eligible = false; // restricted to a different state
    }
    // profile.state unknown => leave eligible, no bonus
  } else {
    score += 5; // open nationally
  }

  // --- Race / ethnicity (restrictive) ---
  const scholEthn = ETHNICITY_TAGS.filter((t) => tags.has(t));
  if (scholEthn.length > 0) {
    const mine = profileEthnicityTags(profile.ethnicity);
    const overlap = scholEthn.filter((t) => mine.has(t));
    if (overlap.length > 0) {
      score += 30;
      reasons.push(`Matches your background (${overlap.join(", ")})`);
    } else if (profile.ethnicity) {
      eligible = false; // it's for a different group and we know yours
    }
  }

  // --- Gender (restrictive when known) ---
  if (tags.has("Women")) {
    if (profile.gender === "Female") {
      score += 15;
      reasons.push("For women");
    } else if (profile.gender && profile.gender !== "Prefer not to say") {
      eligible = false;
    }
  }

  // --- First-gen ---
  if (tags.has("First-Gen")) {
    if (profile.firstGen === true) {
      score += 15;
      reasons.push("Matches your first-gen status");
    } else if (profile.firstGen === false) {
      eligible = false;
    }
  }

  // --- Financial need ---
  if (tags.has("Low Income") || tags.has("Need-Based")) {
    if (lowIncome(profile)) {
      score += 15;
      reasons.push("Matches your financial need");
    }
  }

  // --- Field of study ---
  const field = fieldTagForMajor(profile.intendedMajor);
  if (field && tags.has(field)) {
    score += 15;
    reasons.push(`${field} aligns with your major`);
  }

  // --- Activities-based soft signals ---
  const acts = (profile.activities || "").toLowerCase();
  if (tags.has("Leadership") && /(lead|president|captain|founder)/.test(acts)) {
    score += 5;
    reasons.push("Leadership matches your activities");
  }
  if (tags.has("Community Service") && /(volunteer|service|community)/.test(acts)) {
    score += 5;
    reasons.push("Community service matches your activities");
  }

  return { score: Math.min(100, score), eligible, reasons };
}

// Rank a list of scholarships for a profile: eligible first, then by score.
export function rankScholarships<T extends ScholarshipLike>(
  profile: ProfileLike,
  scholarships: T[]
): Array<T & { match: MatchResult }> {
  return scholarships
    .map((s) => ({ ...s, match: computeMatch(profile, s) }))
    .sort((a, b) => {
      if (a.match.eligible !== b.match.eligible) return a.match.eligible ? -1 : 1;
      return b.match.score - a.match.score;
    });
}
