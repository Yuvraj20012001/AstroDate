import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/matches");

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-5xl font-bold gradient-text mb-3">Soulmate Score</h1>
        <p className="text-inkSoft mb-8">
          Enter your birth details once. See everyone here ranked by how well you match —
          by love, by chemistry, by vibe. No swiping. Just the numbers. ✨
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-bold shadow-lg shadow-pink-200 hover:opacity-90 transition-opacity"
          >
            Create profile
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-full border-2 border-accent text-accent2 font-bold hover:bg-accentSoft transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
