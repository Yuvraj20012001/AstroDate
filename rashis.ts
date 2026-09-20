export type Varna = "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra";

export interface Rashi {
  name: string;
  lord: string;
  varna: Varna;
  element: "Fire" | "Earth" | "Air" | "Water";
}

// Index 0 = Mesha (Aries) ... 11 = Meena (Pisces)
export const RASHIS: Rashi[] = [
  { name: "Mesha (Aries)", lord: "Mars", varna: "Kshatriya", element: "Fire" },
  { name: "Vrishabha (Taurus)", lord: "Venus", varna: "Vaishya", element: "Earth" },
  { name: "Mithuna (Gemini)", lord: "Mercury", varna: "Shudra", element: "Air" },
  { name: "Karka (Cancer)", lord: "Moon", varna: "Brahmin", element: "Water" },
  { name: "Simha (Leo)", lord: "Sun", varna: "Kshatriya", element: "Fire" },
  { name: "Kanya (Virgo)", lord: "Mercury", varna: "Vaishya", element: "Earth" },
  { name: "Tula (Libra)", lord: "Venus", varna: "Shudra", element: "Air" },
  { name: "Vrishchika (Scorpio)", lord: "Mars", varna: "Brahmin", element: "Water" },
  { name: "Dhanu (Sagittarius)", lord: "Jupiter", varna: "Kshatriya", element: "Fire" },
  { name: "Makara (Capricorn)", lord: "Saturn", varna: "Vaishya", element: "Earth" },
  { name: "Kumbha (Aquarius)", lord: "Saturn", varna: "Shudra", element: "Air" },
  { name: "Meena (Pisces)", lord: "Jupiter", varna: "Brahmin", element: "Water" },
];

export const VARNA_RANK: Record<Varna, number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
};
