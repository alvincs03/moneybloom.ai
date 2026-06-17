import * as cheerio from "cheerio";
import type { ScrapedScholarship, Source } from "./types";

// Config-driven HTML scraper engine. Point it at a site's listing page(s) with
// CSS selectors and it will paginate, extract each scholarship, and optionally
// follow each one's detail page for richer fields.
//
// LEGAL / ETHICAL: only scrape sites whose robots.txt and Terms of Service
// permit it. This engine checks robots.txt, sends an honest User-Agent, and
// rate-limits. Never bypass logins, paywalls, or anti-bot measures. Many large
// commercial scholarship sites forbid scraping and render via JavaScript (which
// this fetch-based engine cannot read) — for legitimate bulk data use the
// CareerOneStop API source instead.

export interface FieldSelectors {
  name: string; // selector for the scholarship name (required)
  organization?: string;
  amount?: string;
  deadline?: string;
  description?: string;
  eligibility?: string;
  // Selector for the <a> whose href is the scholarship/application URL.
  urlLink?: string;
}

export interface HtmlSiteConfig {
  name: string; // unique source name
  startUrls: string[]; // one or more listing pages
  itemSelector: string; // selector for each scholarship card/row on the listing
  fields: FieldSelectors; // selectors relative to each item
  nextPageSelector?: string; // optional: <a> to the next listing page
  maxPages?: number; // safety cap on pagination (default 5)
  followDetail?: boolean; // fetch each item's URL and parse detail fields
  detailFields?: Partial<FieldSelectors>; // selectors on the detail page
  requestDelayMs?: number; // politeness delay between requests (default 1500)
}

const USER_AGENT =
  "moneybloomBot/1.0 (+https://moneybloom.ai; scholarship discovery for students)";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function isAllowedByRobots(targetUrl: string): Promise<boolean> {
  try {
    const u = new URL(targetUrl);
    const res = await fetch(`${u.origin}/robots.txt`, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return true; // no robots.txt => allowed
    const lines = (await res.text()).split("\n").map((l) => l.trim());
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
    return !disallows.some((p) => u.pathname.startsWith(p));
  } catch {
    return false; // on error, do not scrape
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    console.warn(`  ! fetch ${res.status} for ${url}`);
    return null;
  }
  return res.text();
}

function pick($: cheerio.CheerioAPI, root: cheerio.Cheerio<never> | null, sel?: string): string | null {
  if (!sel) return null;
  const el = root ? root.find(sel) : $(sel);
  const text = el.first().text().trim();
  return text || null;
}

// Resolve a possibly-relative href against the page URL.
function resolveUrl(href: string | undefined, base: string): string | null {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

export function makeHtmlSource(config: HtmlSiteConfig): Source {
  const delay = config.requestDelayMs ?? 1500;
  const maxPages = config.maxPages ?? 5;

  return {
    name: config.name,
    async run({ limit = 100 }) {
      const results: ScrapedScholarship[] = [];

      for (const startUrl of config.startUrls) {
        if (!(await isAllowedByRobots(startUrl))) {
          console.warn(`  [${config.name}] robots.txt disallows ${startUrl} — skipping`);
          continue;
        }

        let pageUrl: string | null = startUrl;
        let page = 0;

        while (pageUrl && page < maxPages && results.length < limit) {
          page++;
          const html: string | null = await fetchHtml(pageUrl);
          if (!html) break;
          const $ = cheerio.load(html);
          const currentUrl: string = pageUrl;

          const items = $(config.itemSelector).toArray();
          for (const el of items) {
            if (results.length >= limit) break;
            const item = $(el) as unknown as cheerio.Cheerio<never>;

            const name = pick($, item, config.fields.name);
            if (!name) continue;

            const href = item.find(config.fields.urlLink || "a").attr("href");
            const detailUrl = resolveUrl(href, currentUrl);

            const record: ScrapedScholarship = {
              name,
              organization: pick($, item, config.fields.organization),
              amount: pick($, item, config.fields.amount),
              deadline: pick($, item, config.fields.deadline),
              description: pick($, item, config.fields.description),
              eligibility: pick($, item, config.fields.eligibility),
              url: detailUrl,
              sourceUrl: currentUrl,
            };

            // Optionally enrich from the detail page.
            if (config.followDetail && detailUrl && config.detailFields) {
              if (await isAllowedByRobots(detailUrl)) {
                await sleep(delay);
                const detailHtml = await fetchHtml(detailUrl);
                if (detailHtml) {
                  const $d = cheerio.load(detailHtml);
                  const df = config.detailFields;
                  record.description = pick($d, null, df.description) ?? record.description;
                  record.eligibility = pick($d, null, df.eligibility) ?? record.eligibility;
                  record.amount = pick($d, null, df.amount) ?? record.amount;
                  record.deadline = pick($d, null, df.deadline) ?? record.deadline;
                  record.organization = pick($d, null, df.organization) ?? record.organization;
                }
              }
            }

            results.push(record);
          }

          // Find the next page link.
          let next: string | null = null;
          if (config.nextPageSelector) {
            const nextHref = $(config.nextPageSelector).first().attr("href");
            next = resolveUrl(nextHref, currentUrl);
            if (next === currentUrl) next = null; // avoid loops
          }
          pageUrl = next;
          if (pageUrl) await sleep(delay);
        }
      }

      return results;
    },
  };
}
