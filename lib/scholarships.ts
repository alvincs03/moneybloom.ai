// Shared scholarship constants + safe helpers.
// No server-only imports — used by both server pages and client components.

export const SCHOLARSHIP_STATUSES = ["PENDING", "USABLE", "REJECTED"] as const;
export type ScholarshipStatus = (typeof SCHOLARSHIP_STATUSES)[number];

export function isStatus(value: unknown): value is ScholarshipStatus {
  return typeof value === "string" && (SCHOLARSHIP_STATUSES as readonly string[]).includes(value);
}

// Canonical filter tags, grouped by category. The admin UI renders these
// groups; the flat FILTER_TAGS list (derived below) is the validation
// allowlist, so user-supplied tag strings can never inject arbitrary values.
export const TAG_GROUPS: Record<string, string[]> = {
  "Race & Ethnicity": [
    "Black/African American",
    "Hispanic/Latino",
    "Asian American",
    "Native American",
    "Pacific Islander",
    "Middle Eastern/North African",
    "Multiracial",
  ],
  "Field of Study": ["STEM", "Arts", "Humanities", "Business"],
  Background: [
    "First-Gen",
    "Low Income",
    "Women",
    "LGBTQ+",
    "Disability",
    "Military/Veteran",
    "Immigrant",
    "Religious",
  ],
  Type: [
    "Athletics",
    "Community Service",
    "Leadership",
    "Local",
    "Merit-Based",
    "Need-Based",
  ],
};

export const FILTER_TAGS = Object.values(TAG_GROUPS).flat();

export type FilterTag = string;

// US states for the location filter. "" is treated as national/any.
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia",
] as const;

export function isValidState(state: string): boolean {
  return (US_STATES as readonly string[]).includes(state);
}

const TAG_SET = new Set<string>(FILTER_TAGS);

export function isValidTag(tag: string): tag is FilterTag {
  return TAG_SET.has(tag);
}

// Parse a comma-separated tag string into a clean, validated array.
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && isValidTag(t));
}

export function serializeTags(tags: string[]): string {
  // Dedupe + keep only valid tags, stable order by FILTER_TAGS.
  const chosen = new Set(tags.filter(isValidTag));
  return FILTER_TAGS.filter((t) => chosen.has(t)).join(",");
}

// Returns the URL only if it is a safe http(s) link. Blocks javascript:,
// data:, and other schemes that could be used for XSS via href.
export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    return null;
  } catch {
    return null;
  }
}

// Amount range filters used on the public page.
export const AMOUNT_FILTERS: Record<string, { max?: number; min?: number }> = {
  "Under $1k": { max: 1000 },
  "Under $5k": { max: 5000 },
  "$5k+": { min: 5000 },
  "$10k+": { min: 10000 },
};

export function formatAmount(amountValue: number | null, amountText: string | null): string {
  if (amountValue && amountValue > 0) {
    return `$${amountValue.toLocaleString()}`;
  }
  return amountText?.trim() || "Amount varies";
}
