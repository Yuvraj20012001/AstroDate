// Presentation-only layer: translates the classical Ashtakoot koota names
// (produced by lib/ashtakoot.ts, which is unchanged) into consumer-facing
// labels. Never used for scoring, only for display.

export interface KootaMeta {
  label: string;
  chip: string; // short label for sort chips
  icon: string;
}

export const KOOTA_META: Record<string, KootaMeta> = {
  "Varna": { label: "Soul Values Match", chip: "Values", icon: "🧘" },
  "Vashya": { label: "Magnetic Pull", chip: "Pull", icon: "🧲" },
  "Tara": { label: "Luck Sync", chip: "Luck", icon: "🍀" },
  "Yoni": { label: "Physical Chemistry", chip: "Sex", icon: "🔥" },
  "Graha Maitri": { label: "Mental Connection", chip: "Mental", icon: "🧠" },
  "Gana": { label: "Personality Vibe", chip: "Vibe", icon: "✨" },
  "Bhakoot": { label: "Emotional Harmony", chip: "Love", icon: "💗" },
  "Nadi": { label: "Life Force Sync", chip: "Health", icon: "🌙" },
};

export const TOTAL_LABEL = "Soulmate Score";
export const TOTAL_MAX = 36;

export function verdictFor(total: number): string {
  if (total >= 30) return "This is written in the stars 🌟";
  if (total >= 24) return "Strong soulmate potential 💫";
  if (total >= 18) return "Worth exploring 🌙";
  return "It's complicated... 🔮";
}
