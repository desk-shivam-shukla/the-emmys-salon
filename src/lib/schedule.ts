import holiday_jp from '@holiday-jp/holiday_jp';
import type { Availability, SalonSchedule, SlotStatus } from '../schemas/salon';

export const SLOT_SYMBOLS: Record<SlotStatus, string> = {
  open: '○',
  busy: '△',
  full: '×',
};

export type SlotCellKind = SlotStatus | 'closed' | 'outside';

export type SlotCell = {
  date: string;
  hour: string;
  key: string;
  kind: SlotCellKind;
  symbol: string;
  clickable: boolean;
};

export type ScheduleDay = {
  date: string;
  weekdayIndex: number;
  isWeekend: boolean;
  isSalonClosed: boolean;
  isNationalHoliday: boolean;
  holidayNameJa?: string;
  holidayNameEn?: string;
};

export type WeekSchedule = {
  weekStart: string;
  weekEnd: string;
  days: ScheduleDay[];
  hours: string[];
  cells: SlotCell[][];
};

export type ScheduleConfig = SalonSchedule;

function parseDateParts(isoDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = isoDate.split('-').map(Number);
  return { year, month, day };
}

function toLocalDate(isoDate: string): Date {
  const { year, month, day } = parseDateParts(isoDate);
  return new Date(year, month - 1, day);
}

export function formatDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayInJst(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function getMondayOfWeek(isoDate: string): string {
  const date = toLocalDate(isoDate);
  const weekday = date.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + offset);
  return formatDateOnly(date);
}

export function addDays(isoDate: string, days: number): string {
  const date = toLocalDate(isoDate);
  date.setDate(date.getDate() + days);
  return formatDateOnly(date);
}

function parseHour(time: string): number {
  return Number(time.split(':')[0]);
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function isThirdMonday(isoDate: string): boolean {
  const date = toLocalDate(isoDate);
  if (date.getDay() !== 1) return false;
  const dayOfMonth = date.getDate();
  return dayOfMonth >= 15 && dayOfMonth <= 21;
}

export function isSalonClosedDay(isoDate: string, schedule: ScheduleConfig): boolean {
  const weekday = toLocalDate(isoDate).getDay();
  if (schedule.closedWeekdays.includes(weekday)) return true;
  if (schedule.closedMonthly.includes('thirdMonday') && isThirdMonday(isoDate)) {
    return true;
  }
  return false;
}

export function isJapanesePublicHoliday(isoDate: string): boolean {
  return holiday_jp.isHoliday(isoDate);
}

function getHolidayNames(isoDate: string): { ja: string; en: string } | undefined {
  if (!holiday_jp.isHoliday(isoDate)) return undefined;
  const start = toLocalDate(isoDate);
  const end = toLocalDate(isoDate);
  end.setHours(23, 59, 59, 999);
  const found = holiday_jp.between(start, end)[0];
  if (!found) return undefined;
  return { ja: found.name, en: found.name_en };
}

export function effectiveHours(isoDate: string, schedule: ScheduleConfig): { open: number; close: number } {
  const date = toLocalDate(isoDate);
  const isSunday = date.getDay() === 0;
  const isHoliday = isJapanesePublicHoliday(isoDate);
  const range = isSunday || isHoliday ? schedule.sundayAndHoliday : schedule.weekday;
  return { open: parseHour(range.open), close: parseHour(range.close) };
}

export function slotKeysForDay(isoDate: string, schedule: ScheduleConfig): string[] {
  if (isSalonClosedDay(isoDate, schedule)) return [];
  const { open, close } = effectiveHours(isoDate, schedule);
  const hours: string[] = [];
  for (let h = open; h < close; h += schedule.slotMinutes / 60) {
    hours.push(formatHour(h));
  }
  return hours;
}

function slotStorageKey(isoDate: string, hour: string): string {
  return `${isoDate}T${hour}`;
}

export function getSlotStatus(
  isoDate: string,
  hour: string,
  schedule: ScheduleConfig,
  overrides: Availability['slots'],
): SlotCell {
  const key = slotStorageKey(isoDate, hour);
  const closed = isSalonClosedDay(isoDate, schedule);
  if (closed) {
    return { date: isoDate, hour, key, kind: 'closed', symbol: '—', clickable: false };
  }

  const { open, close } = effectiveHours(isoDate, schedule);
  const hourNum = parseHour(hour);
  if (hourNum < open || hourNum >= close) {
    return { date: isoDate, hour, key, kind: 'outside', symbol: '—', clickable: false };
  }

  const override = overrides[key];
  const kind: SlotStatus = override ?? 'open';
  return {
    date: isoDate,
    hour,
    key,
    kind,
    symbol: SLOT_SYMBOLS[kind],
    clickable: kind === 'open',
  };
}

function collectWeekHours(days: string[], schedule: ScheduleConfig): string[] {
  const set = new Set<number>();
  for (const day of days) {
    for (const hour of slotKeysForDay(day, schedule)) {
      set.add(parseHour(hour));
    }
  }
  return [...set].sort((a, b) => a - b).map(formatHour);
}

export function buildWeekSchedule(
  weekStartMonday: string,
  schedule: ScheduleConfig,
  overrides: Availability['slots'],
): WeekSchedule {
  const dayDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartMonday, i));
  const days: ScheduleDay[] = dayDates.map((date) => {
    const holiday = getHolidayNames(date);
    const weekdayIndex = toLocalDate(date).getDay();
    return {
      date,
      weekdayIndex,
      isWeekend: weekdayIndex === 0 || weekdayIndex === 6,
      isSalonClosed: isSalonClosedDay(date, schedule),
      isNationalHoliday: isJapanesePublicHoliday(date),
      holidayNameJa: holiday?.ja,
      holidayNameEn: holiday?.en,
    };
  });

  const hours = collectWeekHours(dayDates, schedule);
  const cells = hours.map((hour) =>
    dayDates.map((date) => getSlotStatus(date, hour, schedule, overrides)),
  );

  return {
    weekStart: weekStartMonday,
    weekEnd: addDays(weekStartMonday, 6),
    days,
    hours,
    cells,
  };
}

export function formatWeekRange(weekStart: string, weekEnd: string, locale: 'ja' | 'en'): string {
  const start = toLocalDate(weekStart);
  const end = toLocalDate(weekEnd);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const fmt = new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', opts);
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function weekdayLabel(weekdayIndex: number, locale: 'ja' | 'en'): string {
  const ja = ['日', '月', '火', '水', '木', '金', '土'];
  const en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return locale === 'ja' ? ja[weekdayIndex] : en[weekdayIndex];
}

export type SchedulePayload = {
  schedule: ScheduleConfig;
  slots: Availability['slots'];
};

export function parseSchedulePayload(raw: string): SchedulePayload {
  return JSON.parse(raw) as SchedulePayload;
}
