import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSections } from "@/lib/profile";
import { saveProfile } from "../actions";

export default async function Questionnaire() {
  const session = await auth();
  const userId = session?.user?.id;
  const profile = userId
    ? await prisma.profile.findUnique({ where: { userId } })
    : null;

  const val = (key: string): string => {
    const v = (profile as Record<string, unknown> | null)?.[key];
    return typeof v === "string" ? v : "";
  };
  const boolVal = (key: string): boolean | null => {
    const v = (profile as Record<string, unknown> | null)?.[key];
    return typeof v === "boolean" ? v : null;
  };

  return (
    <DashboardLayout active="profile">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2 animate-fade-in">
          <Link href="/dashboard/profile" className="text-[#c46039] hover:underline text-sm">
            ← Back to profile
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Profile Questionnaire</h1>
        <p className="text-gray-600 mb-8 animate-fade-in max-w-2xl">
          The richer your profile, the better we can match you. You can leave
          anything blank and come back later.
        </p>

        <form action={saveProfile} className="space-y-6">
          {profileSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold mb-1">{section.title}</h2>
              {section.description && (
                <p className="text-sm text-gray-600 mb-5 max-w-3xl">{section.description}</p>
              )}
              {!section.description && <div className="mb-5" />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {section.fields.map((field) => (
                  <div
                    key={field.key}
                    className={field.full ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-semibold mb-1">
                      {field.label}
                      {field.optional && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          optional
                        </span>
                      )}
                    </label>
                    {field.hint && (
                      <p className="text-xs text-gray-500 mb-2">{field.hint}</p>
                    )}

                    {field.type === "text" && (
                      <input
                        type="text"
                        name={field.key}
                        defaultValue={val(field.key)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039]"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        name={field.key}
                        defaultValue={val(field.key)}
                        placeholder={field.placeholder}
                        rows={field.key === "personalStatement" ? 7 : 4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039] resize-y"
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        name={field.key}
                        defaultValue={val(field.key)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c46039] bg-white"
                      >
                        <option value="">Select…</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "boolean" && (
                      <div className="flex gap-6 pt-1">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={field.key}
                            value="yes"
                            defaultChecked={boolVal(field.key) === true}
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={field.key}
                            value="no"
                            defaultChecked={boolVal(field.key) === false}
                          />
                          No
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 items-center sticky bottom-0 bg-[#f5f0e8] py-4">
            <button
              type="submit"
              className="px-8 py-3 bg-[#c46039] text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              Save profile
            </button>
            <Link href="/dashboard/profile" className="text-gray-600 hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
