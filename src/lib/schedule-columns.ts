import type { ScheduleDay } from './schedule';

export function isWeekendDay(weekdayIndex: number): boolean {
  return weekdayIndex === 0 || weekdayIndex === 6;
}

export function scheduleDayHeaderClass(day: ScheduleDay): string {
  const base = 'sticky top-0 z-20 min-w-[4.5rem] px-2 py-3 text-center';
  if (day.isSalonClosed) return `${base} bg-wood-light/40 opacity-70`;
  if (day.isNationalHoliday) return `${base} schedule-holiday-header`;
  if (day.isWeekend) return `${base} schedule-weekend-header`;
  return `${base} bg-surface-elevated`;
}

export function scheduleCellClass(day: ScheduleDay, clickable: boolean): string {
  const parts = [
    'schedule-cell min-h-11 min-w-[3.25rem] border border-gold-soft/50 px-1 py-2 text-center font-serif text-lg text-wood-deep sm:min-w-[4.5rem]',
  ];
  if (day.isSalonClosed) parts.push('bg-wood-light/25 text-wood-mid');
  else if (day.isNationalHoliday) parts.push('schedule-holiday-cell');
  else if (day.isWeekend) parts.push('schedule-weekend-cell');
  if (clickable) parts.push('schedule-cell-clickable cursor-pointer');
  return parts.join(' ');
}

export function scheduleHolidayDisplayName(
  day: ScheduleDay,
  locale: 'ja' | 'en',
): string | undefined {
  if (!day.isNationalHoliday) return undefined;
  return locale === 'ja' ? day.holidayNameJa : day.holidayNameEn;
}

export function scheduleDayAriaLabel(day: ScheduleDay, locale: 'ja' | 'en'): string | undefined {
  const name = scheduleHolidayDisplayName(day, locale);
  if (!name) return undefined;
  return name;
}
