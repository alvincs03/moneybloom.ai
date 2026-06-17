import { makeHtmlSource } from "../html-source";
import type { Source } from "../types";

// Register HTML scraper sources here, one config per site you are PERMITTED to
// scrape (check the site's robots.txt and Terms of Service first).
//
// Each config points the engine at a listing page and tells it how to find the
// scholarship cards and fields with CSS selectors. The engine paginates and can
// follow each card's detail page. See ../html-source.ts for all options.
//
// NOTE: This fetch-based engine reads server-rendered HTML only. Large
// commercial scholarship sites (Fastweb, Scholarships.com, Bold, etc.) render
// listings with JavaScript and forbid scraping in their Terms — they will not
// work here and should not be added. For legitimate bulk data, use the
// CareerOneStop API source (thousands of scholarships, no scraping).
//
// ---------------------------------------------------------------------------
// EXAMPLE (commented out — replace selectors with a real, permitted site):
//
// const exampleSite = makeHtmlSource({
//   name: "example-scholarships",
//   startUrls: ["https://example.org/scholarships"],
//   itemSelector: ".scholarship-card",
//   nextPageSelector: "a.next-page",
//   maxPages: 5,
//   fields: {
//     name: "h3.title",
//     organization: ".sponsor",
//     amount: ".award-amount",
//     deadline: ".deadline",
//     description: ".summary",
//     urlLink: "a.details-link",
//   },
//   followDetail: true,
//   detailFields: {
//     description: ".scholarship-body",
//     eligibility: ".eligibility",
//   },
// });
// ---------------------------------------------------------------------------

export const htmlSites: Source[] = [
  // exampleSite,
];

// Keep the import referenced so the example stays type-checked even when the
// array above is empty.
void makeHtmlSource;
