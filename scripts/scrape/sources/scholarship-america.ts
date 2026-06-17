import * as cheerio from "cheerio";
import type { ScrapedScholarship, Source } from "../types";
import { USER_AGENT, sleep, isAllowedByRobots } from "../html-source";

// Scrapes Scholarship America (scholarshipamerica.org). Their robots.txt
// permits crawling, pages are server-rendered HTML, and they publish a
// dedicated scholarship sitemap — so we read the sitemap for every scholarship
// URL, then parse each detail page.
//
// Each scholarship lands as PENDING for you to review/approve.

const SITEMAPS = [
  "https://scholarshipamerica.org/scholarship-sitemap.xml",
  "https://scholarshipamerica.org/scholarship-sitemap2.xml",
];

const DELAY_MS = 1200;

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    console.warn(`  ! fetch ${res.status} for ${url}`);
    return null;
  }
  return res.text();
}

async function collectUrls(): Promise<string[]> {
  const urls: string[] = [];
  for (const sm of SITEMAPS) {
    const xml = await fetchText(sm);
    if (!xml) continue;
    const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    for (const m of matches) {
      const url = m.replace(/<\/?loc>/g, "").trim();
      // Only scholarship detail pages; skip recipient-announcement posts.
      if (url.includes("/scholarship/") && !/recipients?\/?$/.test(url)) {
        urls.push(url);
      }
    }
  }
  return [...new Set(urls)];
}

function ddByLabel($: cheerio.CheerioAPI, label: string): string | null {
  let value: string | null = null;
  $("dt").each((_, el) => {
    if (value) return;
    if ($(el).text().trim().toLowerCase() === label.toLowerCase()) {
      const v = $(el).next("dd").text().trim().replace(/\s+/g, " ");
      value = v || null;
    }
  });
  return value;
}

function parseDetail(html: string, url: string): ScrapedScholarship | null {
  const $ = cheerio.load(html);
  const name = $("h1").first().text().trim();
  if (!name) return null;

  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;

  return {
    name,
    amount: ddByLabel($, "Award Amount"),
    deadline: ddByLabel($, "Deadline"),
    level: ddByLabel($, "Institutions"),
    state: ddByLabel($, "State/Territory"), // validated against US states downstream
    description,
    url,
    sourceUrl: url,
  };
}

export const scholarshipAmericaSource: Source = {
  name: "scholarship-america",

  async run({ limit = 100 }) {
    if (!(await isAllowedByRobots(SITEMAPS[0]))) {
      console.warn("  [scholarship-america] robots.txt disallows — skipping");
      return [];
    }

    const allUrls = await collectUrls();
    const urls = allUrls.slice(0, limit);
    console.log(`  [scholarship-america] ${allUrls.length} found, fetching ${urls.length}`);

    const results: ScrapedScholarship[] = [];
    for (const url of urls) {
      const html = await fetchText(url);
      if (html) {
        const record = parseDetail(html, url);
        if (record) results.push(record);
      }
      await sleep(DELAY_MS);
    }
    return results;
  },
};
