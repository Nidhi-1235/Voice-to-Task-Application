/**
 * Turns the human-readable `date_text` / `time_text` stored on a task into a
 * concrete Date, so reminders can fire at the right moment. Returns null when
 * the phrase can't be resolved (e.g. "Not specified", "Next week").
 */

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function startOfDay(base: Date) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Resolves a date phrase to midnight of that day, relative to `now`. */
function resolveDate(dateText: string, now: Date): Date | null {
  const text = dateText.trim().toLowerCase();
  if (!text || text === "not specified") return null;

  if (text === "today" || text === "tonight") return startOfDay(now);
  if (text === "tomorrow") {
    const d = startOfDay(now);
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (text === "day after tomorrow") {
    const d = startOfDay(now);
    d.setDate(d.getDate() + 2);
    return d;
  }

  // Weekday names — the next occurrence (today counts only for "this <day>").
  const weekday = WEEKDAYS.findIndex((day) => text.includes(day));
  if (weekday !== -1) {
    const d = startOfDay(now);
    let delta = (weekday - d.getDay() + 7) % 7;
    if (delta === 0) delta = 7;
    d.setDate(d.getDate() + delta);
    return d;
  }

  // "March 4" / "Mar 4" / "4 March"
  const monthIndex = MONTHS.findIndex(
    (month) => text.includes(month) || text.includes(month.slice(0, 3)),
  );
  const dayMatch = text.match(/\b(\d{1,2})\b/);
  if (monthIndex !== -1 && dayMatch) {
    const d = new Date(now.getFullYear(), monthIndex, Number(dayMatch[1]), 0, 0, 0, 0);
    if (d.getTime() < startOfDay(now).getTime()) d.setFullYear(d.getFullYear() + 1);
    return d;
  }

  // Numeric "12/3" or "12/3/2026" (day/month is ambiguous — assume M/D).
  const numeric = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (numeric) {
    const year = numeric[3]
      ? Number(numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3])
      : now.getFullYear();
    return new Date(year, Number(numeric[1]) - 1, Number(numeric[2]), 0, 0, 0, 0);
  }

  return null;
}

/** Resolves a time phrase to hours/minutes. */
function resolveTime(timeText: string): { hours: number; minutes: number } | null {
  const text = timeText.trim().toLowerCase();
  if (!text || text === "not specified") return null;

  const named: Record<string, [number, number]> = {
    noon: [12, 0],
    midnight: [0, 0],
    morning: [9, 0],
    afternoon: [14, 0],
    evening: [19, 0],
  };
  if (named[text]) {
    const [hours, minutes] = named[text];
    return { hours, minutes };
  }

  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const suffix = match[3];
  if (suffix === "pm" && hours < 12) hours += 12;
  if (suffix === "am" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;

  return { hours, minutes };
}

/**
 * Best-effort due timestamp for a task. Requires at least a resolvable time;
 * with no date it means "today at that time".
 */
export function getTaskDueAt(
  dateText: string,
  timeText: string,
  now: Date = new Date(),
): Date | null {
  const time = resolveTime(timeText);
  if (!time) return null;

  const day = resolveDate(dateText, now) ?? startOfDay(now);
  const due = new Date(day);
  due.setHours(time.hours, time.minutes, 0, 0);
  return due;
}
