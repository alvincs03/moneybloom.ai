"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSections } from "@/lib/profile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const booleanKeys = new Set(
  profileSections.flatMap((s) => s.fields).filter((f) => f.type === "boolean").map((f) => f.key)
);

const stringKeys = profileSections
  .flatMap((s) => s.fields)
  .filter((f) => f.type !== "boolean")
  .map((f) => f.key);

export async function saveProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Build the data object from the submitted form.
  const data: Record<string, string | boolean | null> = {};

  for (const key of stringKeys) {
    const raw = formData.get(key);
    const value = typeof raw === "string" ? raw.trim() : "";
    data[key] = value.length > 0 ? value : null;
  }

  for (const key of booleanKeys) {
    const raw = formData.get(key); // "yes" | "no" | null (unanswered)
    data[key] = raw === "yes" ? true : raw === "no" ? false : null;
  }

  const userId = session.user.id;

  await prisma.profile.upsert({
    where: { userId },
    update: { ...data },
    create: { userId, ...data, completedAt: new Date() },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  redirect("/dashboard/profile");
}
