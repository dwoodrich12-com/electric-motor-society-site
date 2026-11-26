/** Blog posts become visible at 00:00 on their publish date in this zone. */
export const BLOG_PUBLISH_TIME_ZONE = "America/Chicago";

/**
 * Calendar date `YYYY-MM-DD` for `now` in the given IANA time zone.
 * Uses format parts so the result does not depend on the runtime locale.
 */
export function calendarDateInTimeZone(
  now: Date,
  timeZone: string = BLOG_PUBLISH_TIME_ZONE
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find(part => part.type === "year")?.value;
  const month = parts.find(part => part.type === "month")?.value;
  const day = parts.find(part => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error(`Could not read a calendar date in ${timeZone}`);
  }
  return `${year}-${month}-${day}`;
}

/** Leading `YYYY-MM-DD` of a post date. Anything else is not publishable. */
export function publishDateKey(date: string): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(date.trim());
  return match ? match[1] : null;
}

/**
 * A post is public once the Chicago calendar date is on or after its date.
 * Comparison is on the date string, so midnight Chicago is the boundary and
 * UTC parsing of `YYYY-MM-DD` cannot publish a post the evening before.
 */
export function isBlogPostPublished(
  date: string,
  now: Date = new Date()
): boolean {
  const key = publishDateKey(date);
  if (!key) return false;
  return key <= calendarDateInTimeZone(now);
}
