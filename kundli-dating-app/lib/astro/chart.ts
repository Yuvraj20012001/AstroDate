import { NAKSHATRAS, Nakshatra } from "./nakshatras";
import { RASHIS, Rashi } from "./rashis";
import { siderealMoonLongitude, nakshatraFromLongitude, rashiFromLongitude } from "./moon";

export type VashyaGroup = "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";

export interface Chart {
  sidLon: number;
  nakIndex: number;
  pada: number;
  rashiIdx: number;
  vashya: VashyaGroup;
}

function vashyaGroup(rashiIdx: number, sidLon: number): VashyaGroup {
  const degInSign = sidLon % 30;
  if (rashiIdx === 0 || rashiIdx === 1) return "Chatushpada"; // Mesha, Vrishabha
  if (rashiIdx === 2 || rashiIdx === 5 || rashiIdx === 6 || rashiIdx === 10) return "Manava"; // Mithuna, Kanya, Tula, Kumbha
  if (rashiIdx === 3 || rashiIdx === 11) return "Jalachara"; // Karka, Meena
  if (rashiIdx === 4) return "Vanachara"; // Simha
  if (rashiIdx === 7) return "Keeta"; // Vrishchika
  if (rashiIdx === 8) return degInSign < 15 ? "Manava" : "Chatushpada"; // Dhanu (split)
  if (rashiIdx === 9) return degInSign < 15 ? "Chatushpada" : "Jalachara"; // Makara (split)
  return "Manava";
}

/**
 * dateOfBirth: "YYYY-MM-DD", timeOfBirth: "HH:MM" or "HH:MM:SS".
 * Deterministic — same inputs always produce the same chart, so nothing
 * needs to be cached or re-migrated if this logic is ever refined.
 */
export function buildChart(dateOfBirth: string, timeOfBirth: string): Chart {
  const sidLon = siderealMoonLongitude(dateOfBirth, timeOfBirth);
  const { index: nakIndex, pada } = nakshatraFromLongitude(sidLon);
  const rashiIdx = rashiFromLongitude(sidLon);
  return { sidLon, nakIndex, pada, rashiIdx, vashya: vashyaGroup(rashiIdx, sidLon) };
}

export function getNakshatra(index: number): Nakshatra {
  return NAKSHATRAS[index];
}
export function getRashi(index: number): Rashi {
  return RASHIS[index];
}
