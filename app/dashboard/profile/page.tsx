import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  profileSections,
  completionPercent,
  isProfileEmpty,
  sectionStatus,
} from "@/lib/profile";

function displayValue(profile: Record<string, unknown> | null, key: string, type: string) {
  const v = profile?.[key];
  if (v === null || v === undefined || (typeof v === "string" && v.trim() === "")) {
    return { text: "Not set", muted: true };
  }
  if (type === "boolean") {
    return { text: v ? "Yes" : "No", muted: false };
  }
  return { text: String(v), muted: false };
}

export default async function Profile() {
  const session = await auth();
  const userId = session?.user?.id;

  const profile = userId
    ? await prisma.profile.findUnique({ where: { userId } })
    : null;

  const empty = isProfileEmpty(profile);
  const percent = completionPercent(profile);

  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "there";
  const initial = name.charAt(0).toUpperCase();

  return (
    <DashboardLayout active="profile">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">My Profile</h1>

        {/* Empty / incomplete warning banner */}
        {empty ? (
          <div className="bg-orange-50 border-l-4 border-[#c46039] p-6 mb-8 rounded animate-fade-in flex items-start justify-between gap-6">
            <div>
              <p className="font-semibold text-[#c46039] mb-1">
                ⚠️ Your profile is empty
              </p>
              <p className="text-sm text-gray-700">
                We can&apos;t match you to scholarships until you tell us about
                yourself. Fill out the questionnaire to unlock your matches.
              </p>
            </div>
            <Link
              href="/dashboard/profile/questionnaire"
              className="shrink-0 px-6 py-3 bg-[#c46039] text-white rounded-full font-semibold hover:opacity-90 transition whitespace-nowrap"
            >
              Fill out questionnaire →
            </Link>
          </div>
        ) : percent < 100 ? (
          <div className="bg-orange-50 border-l-4 border-[#c46039] p-6 mb-8 rounded animate-fade-in flex items-start justify-between gap-6">
            <div>
              <p className="font-semibold text-[#c46039] mb-1">
                Your profile is {percent}% complete
              </p>
              <p className="text-sm text-gray-700">
                Add the missing details to improve your scholarship matches.
              </p>
            </div>
            <Link
              href="/dashboard/profile/questionnaire"
              className="shrink-0 px-6 py-3 bg-[#c46039] text-white rounded-full font-semibold hover:opacity-90 transition whitespace-nowrap"
            >
              Continue questionnaire →
            </Link>
          </div>
        ) : null}

        {/* Profile header */}
        <div className="bg-white rounded-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#c46039] text-white flex items-center justify-center text-2xl font-bold">
              {initial}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-gray-600 text-sm">
                {session?.user?.email}
              </p>
            </div>
            <div className="text-right">
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#c46039]" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="font-bold">{percent}% complete</p>
            </div>
          </div>
        </div>

        {/* Profile sections */}
        <div className="grid grid-cols-2 gap-6">
          {profileSections.map((section, idx) => {
            const status = sectionStatus(profile, section);
            return (
              <div
                key={section.id}
                className="bg-white rounded-lg p-6 animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      status === "Complete"
                        ? "bg-green-100 text-green-700"
                        : status === "Incomplete"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {section.fields.map((field) => {
                    const { text, muted } = displayValue(profile as Record<string, unknown> | null, field.key, field.type);
                    return (
                      <div key={field.key}>
                        <p className="text-xs text-gray-600 font-semibold">{field.label}</p>
                        <p className={muted ? "text-gray-400" : "text-gray-900"}>{text}</p>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/dashboard/profile/questionnaire"
                  className="block w-full text-center py-2 text-[#c46039] font-semibold hover:bg-gray-50 rounded"
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
