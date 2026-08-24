/**
 * Date handling. Spec §3.
 *
 * Rules that must never be broken:
 *  - Date keys are built from LOCAL calendar parts, never toISOString().
 *  - "Today" means the logical day, which starts at DAY_CUTOFF_HOUR, not midnight.
 *  - Wall-clock time is read in the user's home timezone, so travelling does not
 *    shift or duplicate days.
 */

export const DEFAULT_CUTOFF_HOUR = 4;

/** YYYY-MM-DD from a Date's LOCAL parts. */
export const dateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Inverse of dateKey: local midnight of that calendar date. */
export const parseKey = (k: string): Date => {
  const [y, m, day] = k.split('-').map(Number);
  return new Date(y as number, (m as number) - 1, day as number);
};

export const isDateKey = (k: unknown): k is string =>
  typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k);

/**
 * A Date whose LOCAL fields hold the wall-clock time in `timeZone`.
 * Used so date derivation follows the home timezone rather than the device's.
 */
export const zonedNow = (timeZone: string, now: Date = new Date()): Date => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now);
    const get = (type: string): number => {
      const p = parts.find((x) => x.type === type);
      return p ? Number(p.value) : 0;
    };
    // Some engines render midnight as hour "24".
    return new Date(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  } catch {
    // Unknown timezone id — fall back to device local time rather than throwing.
    return new Date(now);
  }
};

/**
 * The logical "today": before the cutoff hour, the previous calendar day is
 * still in progress (wind-down runs to 23:30 on Wed/Fri). Returns local midnight.
 */
export const logicalToday = (
  timeZone: string,
  cutoffHour: number = DEFAULT_CUTOFF_HOUR,
  now: Date = new Date(),
): Date => {
  const z = zonedNow(timeZone, now);
  if (z.getHours() < cutoffHour) z.setDate(z.getDate() - 1);
  z.setHours(0, 0, 0, 0);
  return z;
};

export const todayKey = (timeZone: string, cutoffHour?: number, now?: Date): string =>
  dateKey(logicalToday(timeZone, cutoffHour, now));

/** Monday of the week containing `d`. Handles getDay()===0 for Sunday. */
export const getMonday = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const offset = (x.getDay() + 6) % 7; // Sun(0) -> 6, Mon(1) -> 0
  x.setDate(x.getDate() - offset);
  return x;
};

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + n);
  return x;
};

/** The 7 date keys of the week containing `d`, Monday first. */
export const weekKeys = (d: Date): string[] => {
  const mon = getMonday(d);
  return Array.from({ length: 7 }, (_, i) => dateKey(addDays(mon, i)));
};

/** Whole days between two calendar dates (b - a), ignoring time of day. */
export const daysBetween = (a: Date, b: Date): number => {
  const ms = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round(ms / 86_400_000);
};

export const isSameDay = (a: Date, b: Date): boolean => dateKey(a) === dateKey(b);

/** True if `key` is a logical day after today — future days are not loggable. */
export const isFutureKey = (key: string, todayK: string): boolean => key > todayK;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const formatLong = (d: Date): string =>
  `${DAYS_LONG[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export const formatShort = (d: Date): string => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

/** "18 Aug – 24 Aug 2026", collapsing a shared month or year. */
export const formatRange = (start: Date, end: Date): string => {
  const sameYear = start.getFullYear() === end.getFullYear();
  const left = sameYear ? formatShort(start) : `${formatShort(start)} ${start.getFullYear()}`;
  return `${left} – ${formatShort(end)} ${end.getFullYear()}`;
};
