// Shared profile field configuration + completion math.
// Imported by both the (server) profile page and the (client) questionnaire,
// so this file must stay free of server-only imports.

export type FieldType = "text" | "select" | "boolean" | "textarea";

export interface ProfileField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

export interface ProfileSection {
  id: string;
  title: string;
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
    title: "Activities & Essays",
    fields: [
      {
        key: "activities",
        label: "Activities",
        type: "textarea",
        placeholder: "e.g. Community Service, Robotics Club, Varsity Soccer",
      },
      {
        key: "bio",
        label: "Short Bio",
        type: "textarea",
        placeholder: "A few sentences about who you are and what you care about.",
      },
    ],
  },
];

// Every questionnaire field key, flattened.
export const allProfileKeys: string[] = profileSections.flatMap((s) =>
  s.fields.map((f) => f.key)
);

// A profile-shaped record: keys map to string | boolean | null.
export type ProfileValues = Record<string, unknown> | null | undefined;

function isAnswered(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true; // booleans (true/false) both count as answered
}

export function countAnswered(profile: ProfileValues): number {
  if (!profile) return 0;
  return allProfileKeys.reduce(
    (n, key) => n + (isAnswered((profile as Record<string, unknown>)[key]) ? 1 : 0),
    0
  );
}

export function completionPercent(profile: ProfileValues): number {
  return Math.round((countAnswered(profile) / allProfileKeys.length) * 100);
}

export function isProfileEmpty(profile: ProfileValues): boolean {
  return countAnswered(profile) === 0;
}

export function sectionStatus(
  profile: ProfileValues,
  section: ProfileSection
): "Complete" | "Incomplete" | "Empty" {
  const answered = section.fields.filter((f) =>
    isAnswered((profile as Record<string, unknown> | null)?.[f.key])
  ).length;
  if (answered === 0) return "Empty";
  if (answered === section.fields.length) return "Complete";
  return "Incomplete";
}
