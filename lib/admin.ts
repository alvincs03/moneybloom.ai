import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Admin access is gated by an email allowlist set in the environment:
//   ADMIN_EMAILS=you@example.com,other@example.com
// Anyone whose signed-in email is not on the list is treated as a normal user.
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

// For server components / pages. Returns the session if the user is an admin,
// otherwise redirects away (never reveals that the page exists).
export async function requireAdminPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/dashboard");
  }
  return session!;
}

// For server actions / mutations. Throws on non-admins so the mutation cannot
// run. Every admin mutation MUST call this first.
export async function requireAdminAction() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    throw new Error("Unauthorized");
  }
  return session!;
}
