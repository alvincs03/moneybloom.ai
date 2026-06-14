// Shared scholarship constants + safe helpers.
// No server-only imports — used by both server pages and client components.

export const SCHOLARSHIP_STATUSES = ["PENDING", "USABLE", "REJECTED"] as const;
export type ScholarshipStatus = (typeof SCHOLARSHIP_STATUSES)[number];

export function isStatus(value: unknown): value is ScholarshipStatus {
  return typeof value === "string" && (SCHOLARSHIP_STATUSES as readonly string[]).includes(value);
}

// Canonical filter tags an admin may assign during verification. The admin
// action rejects any tag not in this allowlist, so user-supplied tag strings
// can never inject arbitrary values.
export const FILTER_TAGS = [
  "STEM",
  "Arts",
  "Humanities",
  "Business",
  "First-Gen",
  "Low Income",
  "Women",
  "Minority",
  "LGBTQ+",
  "Disability",
  "Athletics",
  "Community Service",
  "Leadership",
  "Local",
  "Military/Veteran",
  "Religious",
  "Merit-Based",
  "Need-Based",
] as const;

export type FilterTag = (typeof FILTER_TAGS)[number];

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
