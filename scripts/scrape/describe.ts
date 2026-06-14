import Anthropic from "@anthropic-ai/sdk";

// Generates a clean, student-facing scholarship description with Claude so you
// don't have to write them by hand. Falls back to null (keep the scraped text)
// if no API key is set or the call fails.
//
// Set ANTHROPIC_API_KEY in .env.local. Defaults to Opus 4.8; for cheaper bulk
// runs over many scholarships, set DESCRIBE_MODEL=claude-haiku-4-5.

const MODEL = process.env.DESCRIBE_MODEL || "claude-opus-4-8";

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export interface DescribeInput {
  name: string;
  organization?: string | null;
  amount?: string | null;
  eligibility?: string | null;
  description?: string | null;
  level?: string | null;
}

export async function describeScholarship(input: DescribeInput): Promise<string | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const facts = [
    `Name: ${input.name}`,
    input.organization ? `Organization: ${input.organization}` : null,
    input.amount ? `Award: ${input.amount}` : null,
    input.level ? `Level: ${input.level}` : null,
    input.eligibility ? `Eligibility: ${input.eligibility}` : null,
    input.description ? `Raw description: ${input.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system:
        "You write concise, factual scholarship descriptions for a student-facing scholarship website. " +
        "Given the known facts about a scholarship, write 2-3 plain sentences that tell a student what the " +
        "scholarship is, who it's for, and what it offers. Be specific and neutral. Do not invent facts, " +
        "deadlines, or amounts that are not provided. Do not use marketing language or exclamation points. " +
        "Output only the description text, with no preamble or quotation marks.",
      messages: [
        {
          role: "user",
          content: `Write a description for this scholarship:\n\n${facts}`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return text.length > 0 ? text : null;
  } catch (err) {
    console.warn(
      `  ! description generation failed for "${input.name}":`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
