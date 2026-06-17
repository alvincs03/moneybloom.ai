// Free, deterministic description builder — no API, no cost.
// Produces a clean, student-facing description from the scraped facts. Prefers
// a real scraped description when one exists (cleaned + trimmed to a couple of
// sentences); otherwise composes one from the structured fields.

export interface ComposeInput {
  name: string;
  organization?: string | null;
  amount?: string | null;
  eligibility?: string | null;
  description?: string | null;
  level?: string | null;
}

// Strip boilerplate/marketing noise and collapse whitespace.
function tidy(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\b(click here|apply now|learn more|read more)\b[.!]?/gi, "")
    .replace(/!+/g, ".")
    .trim();
}

// Return the first `n` sentences of a block of text.
function firstSentences(text: string, n: number): string {
  const parts = text.match(/[^.!?]+[.!?]+/g);
  if (!parts) return text;
  return parts.slice(0, n).join(" ").trim();
}

export function composeDescription(input: ComposeInput): string | null {
  const raw = input.description ? tidy(input.description) : "";

  // If we scraped a real description, use it (cleaned, first 2 sentences).
  let base = "";
  if (raw.length >= 60) {
    base = firstSentences(raw, 2);
  } else {
    // Build a factual sentence from the structured fields.
    let sentence = `${input.name} is a scholarship`;
    if (input.organization) sentence += ` from ${input.organization}`;
    if (input.level) sentence += ` for ${input.level.toLowerCase()} students`;
    sentence += ".";
    base = sentence;
  }

  // Ensure the award amount is mentioned if we know it and it's not already there.
  const extras: string[] = [];
  if (input.amount && !base.toLowerCase().includes(input.amount.toLowerCase())) {
    extras.push(`It offers ${input.amount}.`);
  }
  if (
    input.eligibility &&
    input.eligibility.length <= 200 &&
    !base.toLowerCase().includes(input.eligibility.slice(0, 30).toLowerCase())
  ) {
    extras.push(`Eligibility: ${tidy(input.eligibility)}`);
  }

  const result = [base, ...extras].join(" ").replace(/\s+/g, " ").trim();
  if (!result) return null;
  return result.length > 600 ? result.slice(0, 600).trim() : result;
}
