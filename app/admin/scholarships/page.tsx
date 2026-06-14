import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { TAG_GROUPS, US_STATES, parseTags, isStatus } from "@/lib/scholarships";
import { reviewScholarship, regenerateDescription } from "./actions";

export default async function AdminScholarships({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminPage();

  const { status: statusParam } = await searchParams;
  const status = isStatus(statusParam) ? statusParam : "PENDING";

  const [pendingCount, usableCount, rejectedCount, scholarships] = await Promise.all([
    prisma.scholarship.count({ where: { status: "PENDING" } }),
    prisma.scholarship.count({ where: { status: "USABLE" } }),
    prisma.scholarship.count({ where: { status: "REJECTED" } }),
    prisma.scholarship.findMany({
      where: { status },
      orderBy: { scrapedAt: "desc" },
      take: 50,
    }),
  ]);

  const tabs = [
    { key: "PENDING", label: `Pending (${pendingCount})` },
    { key: "USABLE", label: `Usable (${usableCount})` },
    { key: "REJECTED", label: `Rejected (${rejectedCount})` },
  ];

  return (
    <DashboardLayout active="admin">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Scholarship Review</h1>
        <p className="text-gray-600 mb-6">
          Verify scraped scholarships, assign filters, and approve or reject them.
          Only <strong>Usable</strong> scholarships appear to students.
        </p>

        {/* Status tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin/scholarships?status=${tab.key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                status === tab.key
                  ? "bg-[#c46039] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {scholarships.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500">
            No scholarships in this status.
            {status === "PENDING" && (
              <p className="mt-2 text-sm">
                Run <code className="bg-gray-100 px-2 py-1 rounded">npm run db:scrape</code> to
                collect more.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {scholarships.map((s) => {
              const selectedTags = new Set(parseTags(s.tags));
              return (
                <form
                  key={s.id}
                  action={reviewScholarship}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <input type="hidden" name="id" value={s.id} />

                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Name</span>
                        <input
                          name="name"
                          defaultValue={s.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Organization</span>
                        <input
                          name="organization"
                          defaultValue={s.organization ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Amount (text)</span>
                        <input
                          name="amount"
                          defaultValue={s.amount ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Amount value ($)</span>
                        <input
                          name="amountValue"
                          defaultValue={s.amountValue ?? ""}
                          inputMode="numeric"
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Deadline (text)</span>
                        <input
                          name="deadline"
                          defaultValue={s.deadline ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">Level</span>
                        <input
                          name="level"
                          defaultValue={s.level ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-600">
                          State (location-specific)
                        </span>
                        <select
                          name="state"
                          defaultValue={s.state ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1 bg-white"
                        >
                          <option value="">National / Any</option>
                          {US_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block col-span-2">
                        <span className="text-xs font-semibold text-gray-600">Application URL</span>
                        <input
                          name="url"
                          defaultValue={s.url ?? ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                        />
                      </label>
                    </div>
                  </div>

                  <label className="block mb-2">
                    <span className="text-xs font-semibold text-gray-600">Description</span>
                    <textarea
                      name="description"
                      defaultValue={s.description ?? ""}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                    />
                  </label>
                  <button
                    type="submit"
                    formAction={regenerateDescription}
                    className="mb-4 text-xs text-[#c46039] font-semibold hover:underline"
                    title="Rebuild the description from this scholarship's fields (free, no API)"
                  >
                    ↻ Regenerate description
                  </button>

                  {/* Filter tags, grouped by category */}
                  <div className="mb-5 space-y-3">
                    {Object.entries(TAG_GROUPS).map(([group, tags]) => (
                      <div key={group}>
                        <span className="text-xs font-semibold text-gray-600 block mb-1.5">
                          {group}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <label
                              key={tag}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                name="tags"
                                value={tag}
                                defaultChecked={selectedTags.has(tag)}
                              />
                              {tag}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 items-center">
                    <button
                      type="submit"
                      name="decision"
                      value="usable"
                      className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:opacity-90"
                    >
                      ✓ Approve (Usable)
                    </button>
                    <button
                      type="submit"
                      name="decision"
                      value="rejected"
                      className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:opacity-90"
                    >
                      ✕ Reject
                    </button>
                    <button
                      type="submit"
                      name="decision"
                      value="pending"
                      className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-300"
                    >
                      Save (keep pending)
                    </button>
                    {s.sourceUrl && (
                      <span className="ml-auto text-xs text-gray-400">via {s.source}</span>
                    )}
                  </div>
                </form>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
