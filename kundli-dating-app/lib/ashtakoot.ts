import { NAKSHATRAS } from "./astro/nakshatras";
import { RASHIS, VARNA_RANK } from "./astro/rashis";
import { Chart } from "./astro/chart";

export interface KootaResult {
  name: string;
  max: number;
  pts: number;
  detail: string;
  dosha?: boolean;
}
export interface AshtakootResult {
  breakdown: KootaResult[];
  total: number;
}

const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

const YONI_FRIEND_PAIRS: [string, string][] = [
  ["Horse", "Serpent"], ["Deer", "Horse"], ["Horse", "Monkey"], ["Elephant", "Goat"],
  ["Serpent", "Elephant"], ["Elephant", "Buffalo"], ["Monkey", "Elephant"], ["Goat", "Cow"],
  ["Goat", "Buffalo"], ["Mongoose", "Goat"], ["Cat", "Deer"], ["Monkey", "Cat"],
  ["Cow", "Buffalo"], ["Deer", "Cow"], ["Monkey", "Mongoose"],
];
const YONI_ENEMY_PAIRS: [string, string][] = [
  ["Horse", "Buffalo"], ["Elephant", "Lion"], ["Goat", "Monkey"], ["Mongoose", "Serpent"],
  ["Deer", "Dog"], ["Cat", "Rat"], ["Cow", "Tiger"],
];

type VashyaGroup = "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
const VASHYA_MATRIX: Record<VashyaGroup, Record<VashyaGroup, number>> = {
  Chatushpada: { Chatushpada: 2, Manava: 1, Jalachara: 1, Vanachara: 1.5, Keeta: 1 },
  Manava: { Chatushpada: 1, Manava: 2, Jalachara: 1.5, Vanachara: 0, Keeta: 1 },
  Jalachara: { Chatushpada: 1, Manava: 1.5, Jalachara: 2, Vanachara: 1, Keeta: 1 },
  Vanachara: { Chatushpada: 0, Manava: 0, Jalachara: 0, Vanachara: 2, Keeta: 0 },
  Keeta: { Chatushpada: 1, Manava: 1, Jalachara: 1, Vanachara: 0, Keeta: 2 },
};

function taraRemainder(fromIdx: number, toIdx: number): number {
  const count = ((toIdx - fromIdx + 27) % 27) + 1;
  let rem = count % 9;
  if (rem === 0) rem = 9;
  return rem;
}

function planetRelation(p1: string, p2: string): "same" | "friend" | "enemy" | "neutral" {
  if (p1 === p2) return "same";
  if (FRIENDS[p1]?.includes(p2)) return "friend";
  if (ENEMIES[p1]?.includes(p2)) return "enemy";
  return "neutral";
}

/**
 * `groom` / `bride` follow the classical Ashtakoot convention, under which a few
 * kootas (Varna, Vashya) are directional. We assign the male partner to the
 * `groom` slot and the female partner to `bride`; for a same-gender pairing
 * (no classical convention exists) computeAshtakoot() below averages both
 * orientations instead of picking one arbitrarily.
 */
function scoreOriented(groom: Chart, bride: Chart): AshtakootResult {
  const groomRashi = RASHIS[groom.rashiIdx];
  const brideRashi = RASHIS[bride.rashiIdx];
  const groomNak = NAKSHATRAS[groom.nakIndex];
  const brideNak = NAKSHATRAS[bride.nakIndex];

  const breakdown: KootaResult[] = [];

  // 1. Varna
  {
    const gv = VARNA_RANK[groomRashi.varna];
    const bv = VARNA_RANK[brideRashi.varna];
    breakdown.push({
      name: "Varna", max: 1, pts: gv >= bv ? 1 : 0,
      detail: `${groomRashi.varna} & ${brideRashi.varna}`,
    });
  }

  // 2. Vashya
  {
    const pts = VASHYA_MATRIX[bride.vashya][groom.vashya];
    breakdown.push({ name: "Vashya", max: 2, pts, detail: `${groom.vashya} & ${bride.vashya}` });
  }

  // 3. Tara
  {
    const r1 = taraRemainder(groom.nakIndex, bride.nakIndex);
    const r2 = taraRemainder(bride.nakIndex, groom.nakIndex);
    const bad1 = [3, 5, 7].includes(r1);
    const bad2 = [3, 5, 7].includes(r2);
    const pts = !bad1 && !bad2 ? 3 : bad1 && bad2 ? 0 : 1.5;
    breakdown.push({ name: "Tara", max: 3, pts, detail: "Nakshatra-count wellbeing check" });
  }

  // 4. Yoni
  {
    const y1 = groomNak.yoni, y2 = brideNak.yoni;
    let pts: number;
    if (y1 === y2) pts = 4;
    else if (YONI_ENEMY_PAIRS.some(([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1))) pts = 0;
    else if (YONI_FRIEND_PAIRS.some(([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1))) pts = 3;
    else pts = 2;
    breakdown.push({ name: "Yoni", max: 4, pts, detail: `${y1} & ${y2}` });
  }

  // 5. Graha Maitri
  {
    const l1 = groomRashi.lord, l2 = brideRashi.lord;
    let pts: number;
    if (l1 === l2) pts = 5;
    else {
      const r1 = planetRelation(l1, l2);
      const r2 = planetRelation(l2, l1);
      if (r1 === "friend" && r2 === "friend") pts = 5;
      else if ((r1 === "friend" && r2 === "neutral") || (r1 === "neutral" && r2 === "friend")) pts = 4;
      else if (r1 === "neutral" && r2 === "neutral") pts = 3;
      else if ((r1 === "friend" && r2 === "enemy") || (r1 === "enemy" && r2 === "friend")) pts = 1;
      else if ((r1 === "neutral" && r2 === "enemy") || (r1 === "enemy" && r2 === "neutral")) pts = 0.5;
      else pts = 0;
    }
    breakdown.push({ name: "Graha Maitri", max: 5, pts, detail: `${l1} & ${l2}` });
  }

  // 6. Gana
  {
    const g1 = groomNak.gana, g2 = brideNak.gana;
    let pts: number;
    if (g1 === g2) pts = 6;
    else if ((g1 === "Deva" && g2 === "Manushya") || (g1 === "Manushya" && g2 === "Deva")) pts = 5;
    else if ((g1 === "Manushya" && g2 === "Rakshasa") || (g1 === "Rakshasa" && g2 === "Manushya")) pts = 1;
    else pts = 0;
    breakdown.push({ name: "Gana", max: 6, pts, detail: `${g1} & ${g2}` });
  }

  // 7. Bhakoot
  {
    const diff = (bride.rashiIdx - groom.rashiIdx + 12) % 12;
    const dosha = [1, 4, 5, 7, 8, 11].includes(diff);
    breakdown.push({
      name: "Bhakoot", max: 7, pts: dosha ? 0 : 7,
      detail: `${groomRashi.name} & ${brideRashi.name}`, dosha,
    });
  }

  // 8. Nadi
  {
    const same = groomNak.nadi === brideNak.nadi;
    breakdown.push({
      name: "Nadi", max: 8, pts: same ? 0 : 8,
      detail: `${groomNak.nadi} & ${brideNak.nadi}`, dosha: same,
    });
  }

  const total = breakdown.reduce((s, k) => s + k.pts, 0);
  return { breakdown, total };
}

function averageResults(a: AshtakootResult, b: AshtakootResult): AshtakootResult {
  const breakdown = a.breakdown.map((k, i) => ({
    ...k,
    pts: (k.pts + b.breakdown[i].pts) / 2,
    dosha: k.dosha || b.breakdown[i].dosha,
  }));
  const total = breakdown.reduce((s, k) => s + k.pts, 0);
  return { breakdown, total };
}

export function computeAshtakoot(
  a: { chart: Chart; gender: "male" | "female" },
  b: { chart: Chart; gender: "male" | "female" }
): AshtakootResult {
  if (a.gender === b.gender) {
    // No classical convention for a same-gender pairing: average both directional
    // readings rather than arbitrarily privileging one chart as "groom".
    return averageResults(scoreOriented(a.chart, b.chart), scoreOriented(b.chart, a.chart));
  }
  const groom = a.gender === "male" ? a.chart : b.chart;
  const bride = a.gender === "male" ? b.chart : a.chart;
  return scoreOriented(groom, bride);
}
