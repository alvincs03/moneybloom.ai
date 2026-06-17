"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerUser(
  email: string,
  name: string,
  password: string
): Promise<RegisterResult> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { ok: false, error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: cleanEmail,
      name: name.trim() || null,
      passwordHash,
    },
  });

  return { ok: true };
}
