// Lunar-position math ported from the standalone Kundli calculator.
// Same 13-term truncated lunar-longitude series (~1-2 arcminute accuracy)
// plus a linear Lahiri ayanamsa approximation.
//
// PRODUCT DECISION: this app assumes every birth happened in India (IST,
// UTC+5:30), so there is no timezone field to collect. If you ever support
// births outside India, add a timezone column and pass the real offset
// into siderealMoonLongitude() instead of the hardcoded IST_OFFSET_HOURS.

const IST_OFFSET_HOURS = 5.5;

function toJulianDay(year: number, month: number, day: number, hourUT: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}
function norm360(x: number): number {
  x = x % 360;
  return x < 0 ? x + 360 : x;
}

function moonTropicalLongitude(T: number): number {
  const L0 = norm360(218.3164477 + 481267.88123421 * T);
  const D = deg2rad(norm360(297.8501921 + 445267.1114034 * T));
  const M = deg2rad(norm360(357.5291092 + 35999.0502909 * T));
  const Mp = deg2rad(norm360(134.9633964 + 477198.8675055 * T));
  const F = deg2rad(norm360(93.272095 + 483202.0175233 * T));

  let dL = 0;
  dL += 6.288774 * Math.sin(Mp);
  dL += -1.274027 * Math.sin(Mp - 2 * D);
  dL += 0.658314 * Math.sin(2 * D);
  dL += -0.185116 * Math.sin(M);
  dL += -0.059268 * Math.sin(2 * Mp - 2 * D);
  dL += -0.057054 * Math.sin(Mp - 2 * D + M);
  dL += 0.05311 * Math.sin(Mp + 2 * D);
  dL += 0.045785 * Math.sin(2 * D - M);
  dL += 0.040923 * Math.sin(Mp - M);
  dL += -0.034718 * Math.sin(D);
  dL += -0.030383 * Math.sin(Mp + M);
  dL += -0.015565 * Math.sin(2 * F - 2 * D);
  dL += 0.011497 * Math.sin(Mp - 4 * D);

  return norm360(L0 + dL);
}

function lahiriAyanamsa(T: number): number {
  const yearsFrom2000 = T * 100;
  return 23.85333 + yearsFrom2000 * (50.2388 / 3600);
}

/**
 * dateOfBirth: "YYYY-MM-DD"
 * timeOfBirth: "HH:MM" or "HH:MM:SS" (as Postgres returns `time` columns)
 * Returns sidereal (nirayana) Moon longitude in degrees [0, 360).
 */
export function siderealMoonLongitude(dateOfBirth: string, timeOfBirth: string): number {
  const [y, m, d] = dateOfBirth.split("-").map(Number);
  const [hh, mm] = timeOfBirth.split(":").map(Number);

  const localHourDecimal = hh + mm / 60;
  const utHourDecimal = localHourDecimal - IST_OFFSET_HOURS;

  const jd = toJulianDay(y, m, d, utHourDecimal);
  const T = (jd - 2451545.0) / 36525;

  const tropical = moonTropicalLongitude(T);
  const ayanamsa = lahiriAyanamsa(T);
  return norm360(tropical - ayanamsa);
}

export function nakshatraFromLongitude(sidLon: number): { index: number; pada: number } {
  const span = 360 / 27;
  const index = Math.floor(sidLon / span);
  const pada = Math.floor((sidLon % span) / (span / 4)) + 1;
  return { index, pada };
}

export function rashiFromLongitude(sidLon: number): number {
  return Math.floor(sidLon / 30);
}
