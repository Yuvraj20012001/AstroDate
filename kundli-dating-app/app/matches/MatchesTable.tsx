"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KOOTA_META, TOTAL_MAX } from "@/lib/kootaLabels";

export interface CandidateVM {
  id: string;
  username: string;
  name: string;
  city: string;
  total: number;
  breakdown: { name: string; pts: number; max: number }[];
}

// "__total" plus the 8 classical koota keys, in the order chips are shown.
const SORT_OPTIONS: { key: string; chip: string }[] = [
  { key: "__total", chip: "Overall" },
  { key: "Bhakoot", chip: KOOTA_META["Bhakoot"].chip },     // Love
  { key: "Yoni", chip: KOOTA_META["Yoni"].chip },           // Sex
  { key: "Nadi", chip: KOOTA_META["Nadi"].chip },           // Health
  { key: "Graha Maitri", chip: KOOTA_META["Graha Maitri"].chip }, // Mental
  { key: "Gana", chip: KOOTA_META["Gana"].chip },           // Vibe
  { key: "Tara", chip: KOOTA_META["Tara"].chip },           // Luck
  { key: "Varna", chip: KOOTA_META["Varna"].chip },         // Values
  { key: "Vashya", chip: KOOTA_META["Vashya"].chip },       // Pull
];

function valueFor(c: CandidateVM, key: string): { pts: number; max: number } {
  if (key === "__total") return { pts: c.total, max: TOTAL_MAX };
  const k = c.breakdown.find((b) => b.name === key);
  return { pts: k?.pts ?? 0, max: k?.max ?? 0 };
}

export default function MatchesTable({ candidates }: { candidates: CandidateVM[] }) {
  const [sortKey, setSortKey] = useState("__total");

  const sorted = useMemo(() => {
    const list = [...candidates];
    list.sort((a, b) => {
      const av = valueFor(a, sortKey).pts;
      const bv = valueFor(b, sortKey).pts;
      if (bv !== av) return bv - av;
      return b.total - a.total; // tie-break on overall score
    });
    return list;
  }, [candidates, sortKey]);

  const activeChip = SORT_OPTIONS.find((o) => o.key === sortKey)?.chip ?? "Overall";

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            className={
              "shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors " +
              (sortKey === opt.key
                ? "bg-gradient-to-r from-accent to-accent2 text-white border-transparent"
                : "bg-white text-ink border-cardLine")
            }
          >
            {opt.chip}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border border-cardLine rounded-2xl p-8 text-center text-inkSoft">
          No matches yet — check back once more people join.
        </div>
      ) : (
        <div className="bg-white border border-cardLine rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-inkSoft border-b-2 border-accent">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3 text-right">{activeChip}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const { pts, max } = valueFor(r, sortKey);
                return (
                  <tr key={r.id} className="border-b border-cardLine last:border-0 hover:bg-accentSoft">
                    <td className="px-4 py-3 text-inkSoft">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/matches/${r.username}`} className="font-bold text-accent2">
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-inkSoft">{r.city}</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {Number.isInteger(pts) ? pts : pts.toFixed(1)}/{max}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
