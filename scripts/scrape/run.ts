import "dotenv/config";
import { prisma } from "../../lib/prisma";
import { normalize } from "./normalize";
import { composeDescription } from "../../lib/compose-description";
import { classifyScholarship } from "../../lib/classify-scholarship";
import { serializeTags } from "../../lib/scholarships";
import { describeScholarship } from "./describe";
import type { Source } from "./types";

import { careerOneStopSource } from "./sources/careeronestop";
import { htmlTemplateSource } from "./sources/html-template";
import { sampleSource } from "./sources/sample";

// Register scraper sources here. Add new plugins to this list.
const SOURCES: Source[] = [sampleSource, careerOneStopSource, htmlTemplateSource];

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 100;

  let totalScraped = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const source of SOURCES) {
    console.log(`\n▶ Running source: ${source.name}`);
    let records;
    try {
      records = await source.run({ limit });
    } catch (err) {
      console.error(`  ✖ ${source.name} failed:`, err instanceof Error ? err.message : err);
      continue;
    }

    console.log(`  ${records.length} record(s) returned`);
    totalScraped += records.length;

    for (const raw of records) {
      const data = normalize(raw, source.name);
      if (!data) {
        skipped++;
        continue;
      }

      // Dedupe key is (name, url). Prisma parameterizes all values, so there is
      // no SQL injection surface even though the data is scraped.
      const url = data.url ?? "";
      try {
        const existing = await prisma.scholarship.findFirst({
          where: { name: data.name, url },
        });

        if (existing) {
          // Only refresh scraped fields; never clobber an admin's review
          // decision (status, tags, reviewedAt).
          await prisma.scholarship.update({
            where: { id: existing.id },
            data: {
              organization: data.organization,
              amount: data.amount,
              amountValue: data.amountValue,
              deadline: data.deadline,
              deadlineDate: data.deadlineDate,
              description: data.description,
              eligibility: data.eligibility,
              level: data.level,
              sourceUrl: data.sourceUrl,
              source: data.source,
            },
          });
          updated++;
        } else {
          // Write a clean, student-facing description. Free by default
          // (composed from the scraped facts). Set USE_AI_DESCRIPTIONS=1 to
          // use the paid Claude path instead.
          const facts = {
            name: data.name,
            organization: data.organization,
            amount: data.amount,
            eligibility: data.eligibility,
            description: data.description,
            level: data.level,
          };
          const generated = process.env.USE_AI_DESCRIPTIONS
            ? await describeScholarship(facts)
            : null;
          const description =
            generated ?? composeDescription(facts) ?? data.description;

          // Suggest tags + state from the text (admin confirms during review).
          const { tags, state } = classifyScholarship({
            name: data.name,
            organization: data.organization,
            description: data.description,
            eligibility: data.eligibility,
          });

          await prisma.scholarship.create({
            data: {
              ...data,
              description,
              tags: serializeTags(tags),
              state,
              url,
              status: "PENDING",
            },
          });
          inserted++;
        }
      } catch (err) {
        console.error(`  ✖ failed to save "${data.name}":`, err instanceof Error ? err.message : err);
        skipped++;
      }
    }
  }

  console.log(
    `\n✓ Done. scraped=${totalScraped} inserted=${inserted} updated=${updated} skipped=${skipped}`
  );
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal scraper error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
