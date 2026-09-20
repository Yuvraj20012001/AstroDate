import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { buildChart } from "@/lib/astro/chart";
import { computeAshtakoot } from "@/lib/ashtakoot";
import { logoutAction } from "@/app/actions";
import MatchesTable, { CandidateVM } from "./MatchesTable";

interface UserRow {
  id: string;
  username: string;
  name: string;
  gender: "male" | "female";
  date_of_birth: string;
  time_of_birth: string;
  city: string;
}

export default async function MatchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: me } = await supabase
    .from("users")
    .select("id, username, name, gender, looking_for, date_of_birth, time_of_birth, city")
    .eq("id", session.userId)
    .single();
  if (!me) redirect("/login");

  const { data: candidates } = await supabase
    .from("users")
    .select("id, username, name, gender, date_of_birth, time_of_birth, city")
    .eq("gender", me.looking_for)
    .neq("id", me.id)
    .returns<UserRow[]>();

  const myChart = buildChart(me.date_of_birth, me.time_of_birth);

  const candidateVMs: CandidateVM[] = (candidates || []).map((c) => {
    const theirChart = buildChart(c.date_of_birth, c.time_of_birth);
    const { breakdown, total } = computeAshtakoot(
      { chart: myChart, gender: me.gender },
      { chart: theirChart, gender: c.gender }
    );
    return {
      id: c.id,
      username: c.username,
      name: c.name,
      city: c.city,
      total,
      breakdown: breakdown.map((b) => ({ name: b.name, pts: b.pts, max: b.max })),
    };
  });

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-4 flex items-center justify-between">
        <span className="font-display text-2xl font-bold">Soulmate Score</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-highlight">Hi, {me.name}</span>
          <form action={logoutAction}>
            <button className="underline hover:no-underline">Log out</button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Your matches</h1>
        <p className="text-inkSoft text-sm mb-5">
          Tap a category to re-rank everyone by that score specifically.
        </p>

        <MatchesTable candidates={candidateVMs} />
      </div>
    </main>
  );
}
