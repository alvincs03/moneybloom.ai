"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";
import { serializeTags, safeExternalUrl } from "@/lib/scholarships";
import { revalidatePath } from "next/cache";

function str(formData: FormData, key: string, maxLen: number): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const s = raw.replace(/\s+/g, " ").trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function bigText(formData: FormData, key: string, maxLen: number): string | null {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

// Single entry point for reviewing a scholarship. The submit button supplies
// `decision` = "usable" | "rejected" | "pending". Edits are saved either way.
export async function reviewScholarship(formData: FormData) {
  // Authorization gate — non-admins cannot run this mutation.
  await requireAdminAction();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing scholarship id");
  }

  const decisionRaw = formData.get("decision");
  const status =
    decisionRaw === "usable"
      ? "USABLE"
      : decisionRaw === "rejected"
      ? "REJECTED"
      : "PENDING";

  const name = str(formData, "name", 300);
  if (!name) throw new Error("Name is required");

  const essayRaw = formData.get("essayRequired");
  const essayRequired =
    essayRaw === "yes" ? true : essayRaw === "no" ? false : null;

  const amountRaw = formData.get("amountValue");
  let amountValue: number | null = null;
  if (typeof amountRaw === "string" && amountRaw.trim()) {
    const n = parseInt(amountRaw.replace(/[^0-9]/g, ""), 10);
    amountValue = Number.isFinite(n) && n > 0 ? n : null;
  }

  // Tags are validated against the canonical allowlist; anything else is dropped.
  const tags = serializeTags(formData.getAll("tags").map((t) => String(t)));

  await prisma.scholarship.update({
    where: { id },
    data: {
      name,
      organization: str(formData, "organization", 300),
      amount: str(formData, "amount", 120),
      amountValue,
      deadline: str(formData, "deadline", 120),
      url: safeExternalUrl(str(formData, "url", 1000)),
      level: str(formData, "level", 120),
      description: bigText(formData, "description", 5000),
      eligibility: bigText(formData, "eligibility", 5000),
      essayRequired,
      tags,
      status,
      reviewedAt: status === "PENDING" ? null : new Date(),
    },
  });

  revalidatePath("/admin/scholarships");
  revalidatePath("/dashboard/scholarships");
}
