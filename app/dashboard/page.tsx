import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { completionPercent, isProfileEmpty } from "@/lib/profile";
import { rankScholarships, type MatchResult } from "@/lib/match";
import { formatAmount, parseTags, safeExternalUrl } from "@/lib/scholarships";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "there";

  const [profile, usable] = await Promise.all([
    userId ? prisma.profile.findUnique({ where: { userId } }) : null,
    prisma.scholarship.findMany({ where: { status: "USABLE" }, take: 250 }),
  ]);

  const hasProfile = !isProfileEmpty(profile);
  const percent = completionPercent(profile);

  // Rank against the profile when we have one; otherwise show by award size.
  type Card = (typeof usable)[number] & { match: MatchResult | null };
  const ranked = hasProfile && profile ? rankScholarships(profile, usable) : null;
  const eligible = ranked ? ranked.filter((s) => s.match.eligible) : [];
  const display: Card[] = ranked
    ? eligible.slice(0, 8)
    : [...usable]
        .sort((a, b) => (b.amountValue ?? 0) - (a.amountValue ?? 0))
        .slice(0, 8)
        .map((s) => ({ ...s, match: null }));

  return (
    <DashboardLayout active="dashboard">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {name} 👋</h1>
          <p className="text-gray-600">
            {hasProfile
              ? "Here are your best-matched scholarships."
              : "Fill out your profile to get personalized matches."}
          </p>
        </div>

        {/* Profile completion / empty prompt */}
        {percent < 100 && (
          <div className="bg-orange-50 border-l-4 border-[#c46039] p-6 mb-8 rounded animate-fade-in flex justify-between items-start gap-6">
            <div>
              <p className="font-semibold text-[#c46039] mb-1">
                {isProfileEmpty(profile)
                  ? "Complete your profile to unlock matches"
                  : "Complete your profile for better matches"}
              </p>
              <p className="text-sm text-gray-600">
                You&apos;re {percent}% done — the more we know, the better we can rank scholarships for you.
              </p>
            </div>
            <Link
              href="/dashboard/profile/questionnaire"
              className="shrink-0 px-5 py-2.5 bg-[#c46039] text-white rounded-full text-sm font-semibold hover:opacity-90 whitespace-nowrap"
            >
              {isProfileEmpty(profile) ? "Fill out questionnaire →" : "Continue →"}
            </Link>
          </div>
        )}

        {/* Matched scholarships */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {hasProfile ? "Your Matched Scholarships" : "Featured Scholarships"}
            </h2>
            <span className="text-gray-600 text-sm">
              {hasProfile
                ? `${eligible.length} match${eligible.length === 1 ? "" : "es"} found`
                : `${usable.length} available`}
            </span>
          </div>

          {display.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center text-gray-500">
              No scholarships yet — check back soon.
            </div>
          ) : (
            <div className="space-y-4">
              {display.map((s, idx) => {
                const tags = parseTags(s.tags);
                const href = safeExternalUrl(s.url);
                const match = s.match;
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-lg overflow-hidden border-l-4 border-[#5b9e9a] animate-slide-in-right flex"
                    style={{ animationDelay: `${Math.min(idx, 6) * 0.12}s` }}
                  >
                    <div className="w-28 flex-shrink-0 bg-gradient-to-br from-[#c46039] to-[#5b9e9a] flex items-center justify-center">
                      <div className="text-white text-4xl font-bold opacity-25">
                        {s.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
                          {s.organization && (
                            <p className="text-sm text-gray-600">{s.organization}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-[#c46039]">
                            {formatAmount(s.amountValue, s.amount)}
                          </p>
                          {s.deadline && <p className="text-xs text-gray-600">Due {s.deadline}</p>}
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {tags.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        {match ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#5b9e9a]"
                                style={{ width: `${match.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-[#5b9e9a]">
                              {match.score}% match
                            </span>
                            {match.reasons[0] && (
                              <span className="text-xs text-gray-500">· {match.reasons[0]}</span>
                            )}
                          </div>
                        ) : (
                          <span />
                        )}
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-[#c46039] text-sm font-semibold hover:underline"
                          >
                            Apply →
                          </a>
                        ) : (
                          <Link
                            href="/dashboard/scholarships"
                            className="text-[#c46039] text-sm font-semibold hover:underline"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/dashboard/scholarships"
              className="text-[#c46039] font-semibold hover:underline"
            >
              Browse all scholarships →
            </Link>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-green-50 rounded-lg p-6 max-w-md">
          <h3 className="font-bold mb-2">Tip of the day</h3>
          <p className="text-sm text-gray-700">
            Scholarship essays with personal stories are 3x more likely to win. Start with your why.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
