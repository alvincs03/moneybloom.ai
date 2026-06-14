import * as cheerio from "cheerio";
import type { ScrapedScholarship, Source } from "../types";

// TEMPLATE for an HTML scraper source. Copy this file, set real selectors for
// your target site, and register it in run.ts.
//
// IMPORTANT — be a good citizen and stay legal:
//   * Only scrape sites whose robots.txt and Terms of Service permit it.
//   * This template checks robots.txt and refuses to scrape disallowed paths.
//   * It sends an honest User-Agent and rate-limits requests.
//   * Never bypass logins, paywalls, or anti-bot measures.
//
// Disabled by default: it only runs when SCRAPE_HTML_URL is set, so it never
// hits a site you didn't explicitly point it at.

const USER_AGENT =
  "moneybloomBot/1.0 (+https://moneybloom.ai; scholarship discovery for students)";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Minimal robots.txt check: fetch /robots.txt and look for a Disallow that
// covers the target path for our agent (or *). Conservative: on any doubt,
// returns false (do not scrape).
async function isAllowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const u = new URL(targetUrl);
    const robotsUrl = `${u.origin}/robots.txt`;
    const res = await fetch(robotsUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return true; // no robots.txt => allowed
    const text = await res.text();

    const lines = text.split("\n").map((l) => l.trim());
    let appliesToUs = false;
    const disallows: string[] = [];
    for (const line of lines) {
      const [rawKey, ...rest] = line.split(":");
      const key = rawKey?.toLowerCase().trim();
      const value = rest.join(":").trim();
      if (key === "user-agent") {
        appliesToUs = value === "*" || value.toLowerCase().includes("moneybloom");
      } else if (key === "disallow" && appliesToUs && value) {
        disallows.push(value);
      }
    }
    return !disallows.some((path) => u.pathname.startsWith(path));
  } catch {
    return false; // on error, do not scrape
  }
}

export const htmlTemplateSource: Source = {
  name: "html-template",

  async run({ limit = 50 }) {
    const target = process.env.SCRAPE_HTML_URL;
    if (!target) {
      // Disabled unless explicitly pointed at a URL.
      return [];
    }

    if (!(await isAllowedByRobots(target))) {
      console.warn(`[html-template] robots.txt disallows scraping ${target} — skipping`);
      return [];
    }

    const res = await fetch(target, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      throw new Error(`[html-template] fetch failed ${res.status} for ${target}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const results: ScrapedScholarship[] = [];

    // ---- EDIT THESE SELECTORS for your target site ----
    // Example: each scholarship is in a `.scholarship-card` element.
    $(".scholarship-card")
      .slice(0, limit)
      .each((_, el) => {
        const card = $(el);
        const name = card.find(".title").text();
        if (!name.trim()) return;
        results.push({
          name,
          organization: card.find(".org").text() || null,
          amount: card.find(".amount").text() || null,
          deadline: card.find(".deadline").text() || null,
          description: card.find(".description").text() || null,
          url: card.find("a").attr("href") || null,
          sourceUrl: target,
        });
      });
    // ---------------------------------------------------

    await sleep(1000); // be polite between runs
    return results;
  },
};
