export type Gana = "Deva" | "Manushya" | "Rakshasa";
export type Nadi = "Aadi" | "Madhya" | "Antya";

export interface Nakshatra {
  name: string;
  lord: string;
  yoni: string;
  gana: Gana;
  nadi: Nadi;
}

// Same 27-nakshatra table used in the standalone Kundli calculator.
export const NAKSHATRAS: Nakshatra[] = [
  { name: "Ashwini", lord: "Ketu", yoni: "Horse", gana: "Deva", nadi: "Aadi" },
  { name: "Bharani", lord: "Venus", yoni: "Elephant", gana: "Manushya", nadi: "Madhya" },
  { name: "Krittika", lord: "Sun", yoni: "Goat", gana: "Rakshasa", nadi: "Antya" },
  { name: "Rohini", lord: "Moon", yoni: "Serpent", gana: "Manushya", nadi: "Antya" },
  { name: "Mrigashira", lord: "Mars", yoni: "Serpent", gana: "Deva", nadi: "Madhya" },
  { name: "Ardra", lord: "Rahu", yoni: "Dog", gana: "Manushya", nadi: "Aadi" },
  { name: "Punarvasu", lord: "Jupiter", yoni: "Cat", gana: "Deva", nadi: "Aadi" },
  { name: "Pushya", lord: "Saturn", yoni: "Goat", gana: "Deva", nadi: "Madhya" },
  { name: "Ashlesha", lord: "Mercury", yoni: "Cat", gana: "Rakshasa", nadi: "Antya" },
  { name: "Magha", lord: "Ketu", yoni: "Rat", gana: "Rakshasa", nadi: "Antya" },
  { name: "Purva Phalguni", lord: "Venus", yoni: "Rat", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Phalguni", lord: "Sun", yoni: "Cow", gana: "Manushya", nadi: "Aadi" },
  { name: "Hasta", lord: "Moon", yoni: "Buffalo", gana: "Deva", nadi: "Aadi" },
  { name: "Chitra", lord: "Mars", yoni: "Tiger", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Swati", lord: "Rahu", yoni: "Buffalo", gana: "Deva", nadi: "Antya" },
  { name: "Vishakha", lord: "Jupiter", yoni: "Tiger", gana: "Rakshasa", nadi: "Antya" },
  { name: "Anuradha", lord: "Saturn", yoni: "Deer", gana: "Deva", nadi: "Madhya" },
  { name: "Jyeshtha", lord: "Mercury", yoni: "Deer", gana: "Rakshasa", nadi: "Aadi" },
  { name: "Mula", lord: "Ketu", yoni: "Dog", gana: "Rakshasa", nadi: "Aadi" },
  { name: "Purva Ashadha", lord: "Venus", yoni: "Monkey", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Ashadha", lord: "Sun", yoni: "Mongoose", gana: "Manushya", nadi: "Antya" },
  { name: "Shravana", lord: "Moon", yoni: "Monkey", gana: "Deva", nadi: "Antya" },
  { name: "Dhanishta", lord: "Mars", yoni: "Lion", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Shatabhisha", lord: "Rahu", yoni: "Horse", gana: "Rakshasa", nadi: "Antya" },
  { name: "Purva Bhadrapada", lord: "Jupiter", yoni: "Lion", gana: "Manushya", nadi: "Aadi" },
  { name: "Uttara Bhadrapada", lord: "Saturn", yoni: "Cow", gana: "Manushya", nadi: "Madhya" },
  { name: "Revati", lord: "Mercury", yoni: "Elephant", gana: "Deva", nadi: "Madhya" },
];
