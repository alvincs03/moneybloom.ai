import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { prisma } from "@/lib/prisma";
import {
  FILTER_TAGS,
  AMOUNT_FILTERS,
  parseTags,
  formatAmount,
  safeExternalUrl,
} from "@/lib/scholarships";
import type { Prisma } from "@prisma/client";

// A curated subset of tags shown as quick-filter chips.
const FEATURED_TAGS = ["STEM", "Arts", "First-Gen", "Low Income", "Local", "Leadership"];

export default async function Scholarships({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; amount?: string; q?: string }>;
}) {
  const { tag, amount, q } = await searchParams;

  const where: Prisma.ScholarshipWhereInput = { status: "USABLE" };

  if (tag && FILTER_TAGS.includes(tag as never)) {
    where.tags = { contains: tag };
  }
  if (amount && AMOUNT_FILTERS[amount]) {
    const range = AMOUNT_FILTERS[amount];
    const amt: Prisma.IntNullableFilter = {};
    if (range.min) amt.gte = range.min;
    if (range.max) amt.lte = range.max;
    where.amountValue = amt;
  }
  if (q && q.trim()) {
    const term = q.trim().slice(0, 100);
    where.OR = [
      { name: { contains: term } },
      { organization: { contains: term } },
      { description: { contains: term } },
    ];
  }

  const [count, scholarships] = await Promise.all([
    prisma.scholarship.count({ where }),
    prisma.scholarship.findMany({ where, orderBy: { amountValue: "desc" }, take: 60 }),
  ]);

  // Build an href that toggles a tag while preserving other params.
  const chipHref = (key: "tag" | "amount", value: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (key === "tag") {
      if (value) params.set("tag", value);
      if (amount) params.set("amount", amount);
    } else {
      if (tag) params.set("tag", tag);
      if (value) params.set("amount", value);
    }
    const s = params.toString();
    return `/dashboard/scholarships${s ? `?${s}` : ""}`;
  };

  return (
    <DashboardLayout active="scholarships">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in">Scholarships</h1>

        <form method="get" className="mb-6">
          {tag && <input type="hidden" name="tag" value={tag} />}
          {amount && <input type="hidden" name="amount" value={amount} />}
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search scholarships, orgs, or keywords…"
            className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-lg"
          />
        </form>

        {/* Tag filters */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <Link
            href={chipHref("tag", null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !tag ? "bg-[#c46039] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </Link>
          {FEATURED_TAGS.map((t) => (
            <Link
              key={t}
              href={chipHref("tag", tag === t ? null : t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tag === t ? "bg-[#c46039] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Amount filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.keys(AMOUNT_FILTERS).map((a) => (
            <Link
              key={a}
              href={chipHref("amount", amount === a ? null : a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                amount === a ? "bg-[#5b9e9a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {a}
            </Link>
          ))}
        </div>

        <p className="text-gray-600 mb-6">{count} scholarship{count === 1 ? "" : "s"} found</p>

        {scholarships.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            No scholarships match your filters yet.
          </div>
        ) : (
          <div className="space-y-4">
            {scholarships.map((s, i) => {
              const href = safeExternalUrl(s.url);
              const tags = parseTags(s.tags);
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-lg overflow-hidden flex animate-slide-in-right"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.08}s` }}
                >
                  <div className="w-24 flex-shrink-0 bg-gradient-to-br from-[#c46039] to-[#5b9e9a] flex items-center justify-center">
                    <div className="text-white text-2xl font-bold opacity-30">
                      {s.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold mb-1">{s.name}</h3>
                        {s.organization && (
                          <p className="text-sm text-gray-600">{s.organization}</p>
                        )}
                        {tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#c46039]">
                          {formatAmount(s.amountValue, s.amount)}
                        </p>
                        {s.deadline && <p className="text-xs text-gray-600">Due {s.deadline}</p>}
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-block mt-2 text-[#c46039] text-sm font-semibold hover:underline"
                          >
                            Apply →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
