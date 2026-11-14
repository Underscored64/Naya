// Formatting helpers. Money is integer FCFA; dates are "YYYY-MM-DD".

// 45000 -> "45 000 F". Negative: "-12 000 F".
export function formatF(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  const grouped = abs
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); // thin space, e.g. 45 000
  return `${sign}${grouped}\u202fF`;
}

const WEEKDAYS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

// "2026-11-20" -> "vendredi 20 novembre". Uses UTC parts.
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAYS[weekday]} ${d} ${MONTHS[m - 1]}`;
}

// Short form without weekday, e.g. "20 nov.".
export function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const short = MONTHS[m - 1].slice(0, 3).replace("aoû", "aoû");
  return `${d} ${short}.`;
}
