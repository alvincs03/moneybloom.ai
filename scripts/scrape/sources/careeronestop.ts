import type { ScrapedScholarship, Source } from "../types";

// CareerOneStop Scholarship Finder API (U.S. Department of Labor sponsored).
//
// Register for a free API token + userId at:
//   https://www.careeronestop.org/Developers/WebAPI/registration.aspx
//
// Then add to .env.local:
//   CAREERONESTOP_USER_ID=...
//   CAREERONESTOP_API_TOKEN=...
//
// Docs: https://www.careeronestop.org/Developers/WebAPI/Scholarship/list-scholarship.aspx
//
// The response field names vary slightly across records/versions, so we map
// defensively. Run with DEBUG_SCRAPE=1 to dump the first raw record and adjust
// the mappings below if anything looks off.

const BASE = "https://api.careeronestop.org";

// Pick the first defined value from a list of candidate keys (case-insensitive).
function pick(obj: Record<string, unknown>, keys: string[]): string | null {
  const lowerMap = new Map<string, unknown>();
  for (const [k, v] of Object.entries(obj)) lowerMap.set(k.toLowerCase(), v);
  for (const key of keys) {
    const v = lowerMap.get(key.toLowerCase());
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return null;
}

export const careerOneStopSource: Source = {
  name: "careeronestop",

  async run({ limit = 100 }) {
    const userId = process.env.CAREERONESTOP_USER_ID;
    const token = process.env.CAREERONESTOP_API_TOKEN;

    if (!userId || !token) {
      console.warn(
        "[careeronestop] skipped — set CAREERONESTOP_USER_ID and CAREERONESTOP_API_TOKEN in .env.local"
      );
      return [];
    }

    // Path: /v1/scholarshipsearch/{userId}/{keyword}/{sortColumns}/{sortDirection}/{startRecord}/{limitRecord}
    const keyword = "scholarship"; // broad search
    const path = `/v1/scholarshipsearch/${encodeURIComponent(userId)}/${encodeURIComponent(
      keyword
    )}/Name/asc/0/${Math.min(limit, 500)}`;

    const res = await fetch(`${BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `[careeronestop] API error ${res.status} ${res.statusText}: ${body.slice(0, 300)}`
      );
    }

    const data = (await res.json()) as Record<string, unknown>;

    // The list lives under one of these keys depending on API version.
    const list =
      (data.Scholarships as unknown[]) ||
      (data.scholarships as unknown[]) ||
      (data.ResultData as unknown[]) ||
      [];

    if (!Array.isArray(list) || list.length === 0) {
      console.warn("[careeronestop] no records returned. Raw keys:", Object.keys(data));
      return [];
    }

    if (process.env.DEBUG_SCRAPE) {
      console.log("[careeronestop] first raw record:", JSON.stringify(list[0], null, 2));
    }

    const results: ScrapedScholarship[] = [];
    for (const item of list) {
      if (typeof item !== "object" || item === null) continue;
      const o = item as Record<string, unknown>;

      const name = pick(o, ["ScholarshipName", "Title", "Name"]);
      if (!name) continue;

      results.push({
        name,
        organization: pick(o, ["OrganizationName", "Organization", "AwardOrganization", "Sponsor"]),
        amount: pick(o, [
          "AwardAmountDescription",
          "MaximumAward",
          "AwardAmount",
          "Amount",
          "AwardValue",
        ]),
        deadline: pick(o, ["ApplicationDeadline", "DeadlineDate", "Deadline", "ApplicationDueDate"]),
        description: pick(o, ["Purpose", "Description", "ScholarshipDescription"]),
        eligibility: pick(o, ["Eligibility", "EligibilityCriteria", "Qualifications"]),
        level: pick(o, ["LevelOfStudy", "StudyLevel", "Level"]),
        url: pick(o, ["DetailViewURL", "Url", "URL", "ApplicationURL", "Website"]),
        sourceUrl: "https://www.careeronestop.org/Toolkit/Training/find-scholarships.aspx",
      });
    }

    return results;
  },
};
