// Date helpers. All logic works with UTC date parts so results never depend on
// the device's timezone. Dates are "YYYY-MM-DD" strings.

// "YYYY-MM-DD" -> local Date at UTC midnight (kept only as a carrier of the
// year/month/day parts; we never use its wall-clock time).
function toUtcParts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return { y, m, d };
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// Today's date as "YYYY-MM-DD", using the machine's calendar day but normalised
// to UTC parts so downstream arithmetic is timezone-stable.
export function today(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
}

// Add a signed number of days to an ISO date string.
export function addDays(iso: string, days: number): string {
  const { y, m, d } = toUtcParts(iso);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

// Whole days from a to b (b - a). Positive when b is after a.
export function daysBetween(a: string, b: string): number {
  const pa = toUtcParts(a);
  const pb = toUtcParts(b);
  const da = Date.UTC(pa.y, pa.m - 1, pa.d);
  const db = Date.UTC(pb.y, pb.m - 1, pb.d);
  return Math.round((db - da) / 86_400_000);
}

// Inclusive list of "YYYY-MM-DD" strings from `from` to `to`.
// Empty when `to` is before `from`.
export function eachDay(from: string, to: string): string[] {
  const n = daysBetween(from, to);
  if (n < 0) return [];
  const out: string[] = [];
  for (let i = 0; i <= n; i++) out.push(addDays(from, i));
  return out;
}

// First and last day of the month that contains `date`.
export function monthRange(date: string): { start: string; end: string } {
  const { y, m } = toUtcParts(date);
  const start = `${y}-${pad(m)}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate(); // day 0 of next month
  const end = `${y}-${pad(m)}-${pad(lastDay)}`;
  return { start, end };
}
