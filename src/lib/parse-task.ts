/**
 * Local, dependency-free natural-language task parser.
 *
 * Used as a fallback whenever the AI extraction call is unavailable
 * (no network, gateway error, malformed model output). It is intentionally
 * simple and predictable: regex passes for date, then time, then a cleanup
 * pass that turns the leftover sentence into a concise task title.
 */

export interface ExtractedTask {
  task: string;
  date: string;
  time: string;
}

export const NOT_SPECIFIED = "Not specified";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
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

/** Leading filler phrases that add nothing to a task title. */
const FILLER_PREFIXES = [
  /^remind me to\s+/i,
  /^remind me\s+/i,
  /^please\s+/i,
  /^i need to\s+/i,
  /^i have to\s+/i,
  /^i want to\s+/i,
  /^don'?t forget to\s+/i,
  /^make sure to\s+/i,
  /^set a reminder to\s+/i,
  /^add a task to\s+/i,
  /^add task\s+/i,
];

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Pulls the first date-like phrase out of the sentence. */
function extractDate(input: string): { date: string; rest: string } {
  const patterns: RegExp[] = [
    /\b(day after tomorrow|tomorrow|today|tonight|this weekend|next week|next month)\b/i,
    new RegExp(`\\b(?:on\\s+|next\\s+|this\\s+)?(${WEEKDAYS.join("|")})\\b`, "i"),
    new RegExp(
      `\\b(?:on\\s+)?(${MONTHS.join("|")}|${MONTHS.map((m) => m.slice(0, 3)).join("|")})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`,
      "i",
    ),
    /\b(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)\s+(?:of\s+)?([a-z]+)\b/i,
    /\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/,
    /\bon the (\d{1,2})(?:st|nd|rd|th)\b/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const raw = match[0]
        .replace(/^\s*(on|next|this)\s+/i, (m) =>
          /next|this/i.test(m) ? m.trim() + " " : "",
        )
        .trim();
      return {
        date: titleCase(raw),
        rest: input.replace(match[0], " "),
      };
    }
  }

  return { date: NOT_SPECIFIED, rest: input };
}

/** Pulls the first clock time out of the sentence and normalises it. */
function extractTime(input: string): { time: string; rest: string } {
  const meridiem = input.match(
    /\b(?:at\s+|by\s+|around\s+)?(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?\b/i,
  );
  if (meridiem) {
    const hour = Number(meridiem[1]);
    const minutes = meridiem[2] ?? "00";
    const suffix = meridiem[3].toLowerCase() === "a" ? "AM" : "PM";
    return {
      time: `${hour}:${minutes} ${suffix}`,
      rest: input.replace(meridiem[0], " "),
    };
  }

  const military = input.match(/\b(?:at|by)\s+(\d{1,2}):(\d{2})\b/i);
  if (military) {
    let hour = Number(military[1]);
    const minutes = military[2];
    const suffix = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return {
      time: `${hour}:${minutes} ${suffix}`,
      rest: input.replace(military[0], " "),
    };
  }

  const named = input.match(/\b(noon|midnight|morning|afternoon|evening)\b/i);
  if (named) {
    return {
      time: titleCase(named[1].toLowerCase()),
      rest: input.replace(named[0], " "),
    };
  }

  return { time: NOT_SPECIFIED, rest: input };
}

/** Cleans the remaining sentence fragment into a short task title. */
function cleanTitle(input: string, original: string) {
  let title = input;

  for (const filler of FILLER_PREFIXES) {
    title = title.replace(filler, "");
  }

  title = title
    .replace(/\b(at|on|by|around|for)\s*$/i, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[.,;:\s]+$/g, "")
    .trim();

  if (!title) {
    title = original.trim();
  }

  return titleCase(title);
}

/**
 * Parses a raw natural-language command into a task/date/time triple.
 * Always returns a usable result — never throws.
 */
export function parseTaskLocally(input: string): ExtractedTask {
  const original = input.trim();
  const { date, rest: afterDate } = extractDate(original);
  const { time, rest: afterTime } = extractTime(afterDate);

  return {
    task: cleanTitle(afterTime, original),
    date,
    time,
  };
}
