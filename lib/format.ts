/* Pure helpers, safe to use in client components. */
export function formatDate(d: string, withYear = true) {
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

/* "412K" -> 412000, used to rank posts by views */
export function viewsToNumber(v: string) {
  const m = String(v).match(/([\d.]+)\s*([KkMm]?)/);
  if (!m) return 0;
  const mult = { k: 1e3, m: 1e6 }[m[2].toLowerCase() as "k" | "m"] ?? 1;
  return parseFloat(m[1]) * mult;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const summary = <T extends { html: string }>({ html: _html, ...rest }: T) => rest;
