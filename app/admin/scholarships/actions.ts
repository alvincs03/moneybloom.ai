"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/admin";
import { serializeTags, safeExternalUrl, isValidState } from "@/lib/scholarships";
import { composeDescription } from "@/lib/compose-description";
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

  const amountRaw = formData.get("amountValue");
  let amountValue: number | null = null;
  if (typeof amountRaw === "string" && amountRaw.trim()) {
    const n = parseInt(amountRaw.replace(/[^0-9]/g, ""), 10);
    amountValue = Number.isFinite(n) && n > 0 ? n : null;
  }

  // Tags are validated against the canonical allowlist; anything else is dropped.
  const tags = serializeTags(formData.getAll("tags").map((t) => String(t)));

  // State validated against the US states allowlist; "" => national/any.
  const stateRaw = formData.get("state");
  const state = typeof stateRaw === "string" && isValidState(stateRaw) ? stateRaw : null;

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
      state,
      description: bigText(formData, "description", 5000),
      eligibility: bigText(formData, "eligibility", 5000),
      tags,
      status,
      reviewedAt: status === "PENDING" ? null : new Date(),
    },
  });

  revalidatePath("/admin/scholarships");
  revalidatePath("/dashboard/scholarships");
}

// Rebuild a single scholarship's description from its structured fields, for
// free (no API). Composes from name/org/amount/level/eligibility.
export async function regenerateDescription(formData: FormData) {
  await requireAdminAction();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    throw new Error("Missing scholarship id");
  }

  const s = await prisma.scholarship.findUnique({ where: { id } });
  if (!s) throw new Error("Scholarship not found");

  const description = composeDescription({
    name: s.name,
    organization: s.organization,
    amount: s.amount,
    eligibility: s.eligibility,
    level: s.level,
    // Omit the current description so we rebuild from the facts.
    description: null,
  });

  await prisma.scholarship.update({
    where: { id },
    data: { description: description ?? s.description },
  });

  revalidatePath("/admin/scholarships");
}
