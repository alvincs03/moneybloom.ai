// Free, deterministic tag + state suggester — no API.
// Scans a scholarship's text for keywords and proposes canonical tags and a
// US state. These are SUGGESTIONS: scraped rows stay PENDING and an admin
// confirms/edits them in the review UI before they go live.

import { US_STATES } from "./scholarships";

export interface ClassifyInput {
  name: string;
  organization?: string | null;
  description?: string | null;
  eligibility?: string | null;
}

export interface Classification {
  tags: string[];
  state: string | null;
}

// canonical tag -> keywords/phrases that imply it. Matched case-insensitively
// on word boundaries so "art" won't match "start".
const TAG_KEYWORDS: Record<string, string[]> = {
  // Race & Ethnicity
  "Black/African American": ["black", "african american", "african-american"],
  "Hispanic/Latino": ["hispanic", "latino", "latina", "latinx", "chicano"],
  "Asian American": ["asian", "asian american", "asian-american"],
  "Native American": ["native american", "american indian", "indigenous", "tribal", "alaska native"],
  "Pacific Islander": ["pacific islander", "native hawaiian", "polynesian"],
  "Middle Eastern/North African": ["middle eastern", "arab", "north african", "mena"],
  Multiracial: ["multiracial", "biracial", "mixed race", "multi-ethnic"],
  // Field of study
  STEM: ["stem", "science", "technology", "engineering", "mathematics", "computer science", "robotics"],
  Arts: ["art", "arts", "music", "theater", "theatre", "dance", "design", "visual arts"],
  Humanities: ["humanities", "literature", "history", "philosophy", "writing", "english"],
  Business: ["business", "entrepreneur", "entrepreneurship", "finance", "accounting", "marketing"],
  // Background
  "First-Gen": ["first generation", "first-generation", "first gen"],
  "Low Income": ["low income", "low-income", "financial need", "underprivileged", "underserved"],
  Women: ["women", "woman", "female", "girls"],
  "LGBTQ+": ["lgbtq", "lgbt", "queer", "gay", "lesbian", "transgender", "nonbinary"],
  Disability: ["disability", "disabilities", "disabled", "blind", "deaf"],
  "Military/Veteran": ["veteran", "veterans", "military", "armed forces", "active duty"],
  Immigrant: ["immigrant", "undocumented", "daca", "dreamer", "refugee"],
  Religious: ["christian", "catholic", "jewish", "muslim", "religious", "lutheran", "methodist"],
  // Type
  Athletics: ["athlete", "athletic", "athletics", "sports", "varsity"],
  "Community Service": ["community service", "volunteer", "volunteering", "service to"],
  Leadership: ["leadership", "leader"],
  "Merit-Based": ["merit", "academic achievement", "academic excellence", "gpa"],
  "Need-Based": ["need-based", "need based", "demonstrated need", "financial need"],
};

function matches(text: string, keyword: string): boolean {
  // Word-boundary match; escape regex metachars in the keyword.
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

export function classifyScholarship(input: ClassifyInput): Classification {
  const text = [input.name, input.organization, input.description, input.eligibility]
    .filter(Boolean)
    .join(" \n ");

  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => matches(text, kw))) tags.push(tag);
  }

  // State: only suggest when exactly one state name is mentioned (otherwise
  // it's ambiguous — likely a national award listing many states).
  const found = US_STATES.filter((st) => matches(text, st));
  const state = found.length === 1 ? found[0] : null;

  return { tags, state };
}
