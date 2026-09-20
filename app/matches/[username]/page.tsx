import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { buildChart } from "@/lib/astro/chart";
import { computeAshtakoot } from "@/lib/ashtakoot";
import { KOOTA_META, TOTAL_MAX, verdictFor } from "@/lib/kootaLabels";

export default async function MatchDetailPage({ params }: { params: { username: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: me } = await supabase
    .from("users")
    .select("id, name, gender, date_of_birth, time_of_birth")
    .eq("id", session.userId)
    .single();
  if (!me) redirect("/login");

  const { data: other } = await supabase
    .from("users")
    .select("id, username, name, gender, date_of_birth, time_of_birth, city")
    .eq("username", params.username)
    .maybeSingle();
  if (!other) notFound();

  const myChart = buildChart(me.date_of_birth, me.time_of_birth);
  const theirChart = buildChart(other.date_of_birth, other.time_of_birth);
  const { breakdown, total } = computeAshtakoot(
    { chart: myChart, gender: me.gender },
    { chart: theirChart, gender: other.gender }
  );

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-4">
        <Link href="/matches" className="text-highlight text-sm">&larr; Back to matches</Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-ink">{other.name}</h1>
        <p className="text-inkSoft mb-6">{other.city}</p>

        <div className="bg-white border border-cardLine rounded-2xl p-6 text-center mb-6 shadow-sm">
          <div className="text-xs uppercase tracking-wide font-bold text-inkSoft">Soulmate Score</div>
          <div className="font-display text-5xl font-bold gradient-text">
            {Number.isInteger(total) ? total : total.toFixed(1)}
            <span className="text-xl text-inkSoft"> / {TOTAL_MAX}</span>
          </div>
          <p className="mt-1 font-bold text-good">{verdictFor(total)}</p>
          <Link
            href={`/messages/${other.username}`}
            className="inline-block mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-bold text-sm"
          >
            Message {other.name} 💬
          </Link>
        </div>

        <h3 className="font-display text-lg font-bold text-ink mb-3">The breakdown</h3>
        <div className="flex flex-col gap-3">
          {breakdown.map((k) => {
            const meta = KOOTA_META[k.name];
            const pct = Math.round((k.pts / k.max) * 100);
            return (
              <div key={k.name} className="bg-white border border-cardLine rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm flex items-center gap-2">
                    <span>{meta.icon}</span> {meta.label}
                  </span>
                  <span className="text-sm font-bold text-inkSoft">
                    {Number.isInteger(k.pts) ? k.pts : k.pts.toFixed(1)} / {k.max}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-accentSoft overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
