// A single scholarship as produced by a scraper source, before it is
// normalized and written to the database.
export interface ScrapedScholarship {
  name: string; // required
  organization?: string | null;
  amount?: string | null; // raw amount text as seen on the source
  amountValue?: number | null; // parsed max award in whole dollars
  deadline?: string | null; // raw deadline text
  deadlineDate?: Date | null;
  description?: string | null;
  eligibility?: string | null;
  url?: string | null; // official/application URL
  essayRequired?: boolean | null;
  level?: string | null;
  tags?: string[]; // suggested tags (admin still verifies)
  sourceUrl?: string | null; // page it was scraped from
}

// A pluggable scraper source. Add a new file under sources/ that exports a
// Source and register it in run.ts.
export interface Source {
  name: string;
  // Should be safe to run repeatedly; the runner handles dedupe + upsert.
  run(options: { limit?: number }): Promise<ScrapedScholarship[]>;
}
