// Shared profile field configuration + completion math.
// Imported by both the (server) profile page and the (server) questionnaire,
// so this file must stay free of server-only imports.

export type FieldType = "text" | "select" | "boolean" | "textarea";

export interface ProfileField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean; // span the full row instead of half
  optional?: boolean; // does not count toward completion %
  hint?: string;
}

export interface ProfileSection {
  id: string;
  title: string;
  description?: string;
  fields: ProfileField[];
}

export const profileSections: ProfileSection[] = [
  {
    id: "academic",
    title: "Academic Info",
    fields: [
      { key: "school", label: "School", type: "text", placeholder: "e.g. Lincoln High School" },
      { key: "gpa", label: "GPA", type: "text", placeholder: "e.g. 3.8 unweighted" },
      {
        key: "gradeLevel",
        label: "Grade Level",
        type: "select",
        options: ["9th", "10th", "11th", "12th", "College Freshman", "College Sophomore", "Other"],
      },
      { key: "intendedMajor", label: "Intended Major", type: "text", placeholder: "e.g. Computer Science" },
    ],
  },
  {
    id: "financial",
    title: "Financial Background",
    fields: [
      {
        key: "householdIncome",
        label: "Household Income",
        type: "select",
        options: ["Under $30k", "$30k–$60k", "$60k–$100k", "$100k–$150k", "Over $150k", "Prefer not to say"],
      },
      { key: "firstGen", label: "First-Generation College Student", type: "boolean" },
      { key: "freeReducedLunch", label: "Free/Reduced Lunch", type: "boolean" },
      { key: "pellEligible", label: "Pell Grant Eligible", type: "boolean" },
    ],
  },
  {
    id: "identity",
    title: "Identity & Background",
    fields: [
      { key: "ethnicity", label: "Ethnicity", type: "text", placeholder: "e.g. Filipino" },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: ["Female", "Male", "Non-binary", "Prefer not to say"],
      },
      { key: "state", label: "State", type: "text", placeholder: "e.g. California" },
      {
        key: "locality",
        label: "Area Type",
        type: "select",
        options: ["Urban", "Suburban", "Rural"],
      },
    ],
  },
  {
    id: "activities",
    title: "Activities & Awards",
    fields: [
      {
        key: "activities",
        label: "Activities",
        type: "textarea",
        full: true,
        placeholder: "e.g. Community Service, Robotics Club, Varsity Soccer",
      },
      {
        key: "awards",
        label: "Honors & Awards",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "e.g. National Merit Finalist, Science Fair 1st Place",
      },
      {
        key: "bio",
        label: "Headline",
        type: "text",
        full: true,
        optional: true,
        placeholder: "One line that sums you up — e.g. \"First-gen CS student building robots for my hometown\"",
      },
    ],
  },
  {
    id: "essays",
    title: "Essays",
    description:
      "Your personal statement is the foundation of most applications. The optional prompts below cover the questions scholarships ask most often — drafting them now means you can reuse and adapt them later.",
    fields: [
      {
        key: "personalStatement",
        label: "Personal Statement",
        type: "textarea",
        full: true,
        hint: "Your core story — who you are, where you come from, and where you're headed.",
        placeholder: "Tell your story in a few paragraphs…",
      },
      {
        key: "challengeEssay",
        label: "A challenge or obstacle you've overcome",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "Describe a setback and what you learned from it.",
      },
      {
        key: "communityEssay",
        label: "Your community involvement & impact",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "How have you contributed to your community?",
      },
      {
        key: "goalsEssay",
        label: "Your academic & career goals",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "What do you want to study, and what do you hope to do with it?",
      },
      {
        key: "leadershipEssay",
        label: "A leadership experience",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "When did you take initiative or lead others?",
      },
      {
        key: "diversityEssay",
        label: "What makes you unique",
        type: "textarea",
        full: true,
        optional: true,
        placeholder: "Share a background, perspective, or identity that shapes who you are.",
      },
    ],
  },
];

const allFields = profileSections.flatMap((s) => s.fields);

// Every questionnaire field key (used when saving).
export const allProfileKeys: string[] = allFields.map((f) => f.key);

// Keys that count toward completion (optional fields excluded).
export const requiredKeys: string[] = allFields.filter((f) => !f.optional).map((f) => f.key);

export type ProfileValues = Record<string, unknown> | null | undefined;

function isAnswered(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true; // booleans (true/false) both count as answered
}

// Counts answers among ALL fields (used to decide whether a profile is empty).
export function countAnswered(profile: ProfileValues): number {
  if (!profile) return 0;
  return allProfileKeys.reduce(
    (n, key) => n + (isAnswered((profile as Record<string, unknown>)[key]) ? 1 : 0),
    0
  );
}

// Completion % is based on required fields only.
export function completionPercent(profile: ProfileValues): number {
  if (!profile) return 0;
  const answered = requiredKeys.filter((key) =>
    isAnswered((profile as Record<string, unknown>)[key])
  ).length;
  return Math.round((answered / requiredKeys.length) * 100);
}

export function isProfileEmpty(profile: ProfileValues): boolean {
  return countAnswered(profile) === 0;
}

export function sectionStatus(
  profile: ProfileValues,
  section: ProfileSection
): "Complete" | "Incomplete" | "Empty" | "Optional" {
  const required = section.fields.filter((f) => !f.optional);
  const record = profile as Record<string, unknown> | null;

  // Section made up entirely of optional fields (e.g. extra essays).
  if (required.length === 0) {
    const anyAnswered = section.fields.some((f) => isAnswered(record?.[f.key]));
    return anyAnswered ? "Complete" : "Optional";
  }

  const answered = required.filter((f) => isAnswered(record?.[f.key])).length;
  if (answered === 0) return "Empty";
  if (answered === required.length) return "Complete";
  return "Incomplete";
}
