import type { ScrapedScholarship } from "./types";

// Collapse whitespace, trim, and cap length. Returns null for empty strings so
// we never store noise. The length cap also protects the DB from absurdly
// large scraped blobs.
export function clean(value: unknown, maxLen = 4000): string | null {
  if (typeof value !== "string") return null;
  const s = value.replace(/\s+/g, " ").trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

// Parse a dollar amount out of free text like "$20,000", "Up to $10,000",
// "$5,000/yr", "5000". Returns the largest number found (the max award).
export function parseAmount(text: unknown): number | null {
  if (typeof text === "number" && Number.isFinite(text)) {
    return Math.round(text);
  }
  if (typeof text !== "string") return null;
  const matches = text.match(/\$?\s?\d{1,3}(?:,\d{3})+|\$\s?\d+|\b\d{4,6}\b/g);
  if (!matches) return null;
  const numbers = matches
    .map((m) => parseInt(m.replace(/[^0-9]/g, ""), 10))
    .filter((n) => Number.isFinite(n) && n > 0 && n < 10_000_000);
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

// Best-effort deadline parse. Returns null if it can't be parsed confidently.
export function parseDeadline(text: unknown): Date | null {
  if (text instanceof Date) return Number.isNaN(text.getTime()) ? null : text;
  if (typeof text !== "string") return null;
  const t = text.trim();
  if (!t) return null;
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) {
    // Sanity window: ignore obviously bogus dates.
    const year = d.getFullYear();
    if (year >= 2000 && year <= 2100) return d;
  }
  return null;
}

// Final guard applied to every scraped record before it reaches the DB.
// Ensures a usable name and clamps all text fields.
export function normalize(raw: ScrapedScholarship, source: string) {
  const name = clean(raw.name, 300);
  if (!name) return null; // drop records without a name

  return {
    name,
    organization: clean(raw.organization, 300),
    amount: clean(raw.amount, 120),
    amountValue:
      typeof raw.amountValue === "number" && raw.amountValue > 0
        ? Math.round(raw.amountValue)
        : parseAmount(raw.amount),
    deadline: clean(raw.deadline, 120),
    deadlineDate: raw.deadlineDate ?? parseDeadline(raw.deadline),
    description: clean(raw.description, 5000),
    eligibility: clean(raw.eligibility, 5000),
    url: clean(raw.url, 1000),
    essayRequired: typeof raw.essayRequired === "boolean" ? raw.essayRequired : null,
    level: clean(raw.level, 120),
    sourceUrl: clean(raw.sourceUrl, 1000),
    source,
  };
}
