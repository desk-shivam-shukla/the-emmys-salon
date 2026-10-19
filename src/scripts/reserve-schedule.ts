import {
  addDays,
  buildWeekSchedule,
  formatWeekRange,
  parseSchedulePayload,
  weekdayLabel,
} from '../lib/schedule';
import {
  scheduleCellClass,
  scheduleDayAriaLabel,
  scheduleDayHeaderClass,
  scheduleHolidayDisplayName,
} from '../lib/schedule-columns';

export function initReserveSchedule(root: HTMLElement): void {
  const payloadEl = document.getElementById('schedule-payload');
  const weekLabel = root.querySelector('[data-week-label]');
  const tbody = root.querySelector('[data-schedule-body]');
  const theadRow = root.querySelector('[data-schedule-table] thead tr');

  if (!payloadEl || !weekLabel || !tbody || !theadRow) return;

  const locale = (root.dataset.locale ?? 'ja') as 'ja' | 'en';
  const googleFormUrl = root.dataset.googleFormUrl ?? '';
  let weekStart = root.dataset.initialMonday ?? '';

  if (!weekStart) return;

  const { schedule, slots } = parseSchedulePayload(payloadEl.textContent ?? '{}');

  const render = () => {
    const week = buildWeekSchedule(weekStart, schedule, slots);
    weekLabel.textContent = formatWeekRange(week.weekStart, week.weekEnd, locale);

    theadRow.querySelectorAll('[data-day-header]').forEach((el) => el.remove());
    week.days.forEach((day) => {
      const th = document.createElement('th');
      th.className = scheduleDayHeaderClass(day);
      th.setAttribute('data-day-header', day.date);
      const label = scheduleDayAriaLabel(day, locale);
      if (label) th.setAttribute('aria-label', label);
      const weekday = document.createElement('span');
      weekday.className = 'block font-serif text-base text-wood-deep';
      weekday.textContent = weekdayLabel(day.weekdayIndex, locale);
      const date = document.createElement('span');
      date.className = 'mt-0.5 block text-xs text-wood-mid';
      date.textContent = day.date.slice(5).replace('-', '/');
      th.append(weekday, date);
      const holidayName = scheduleHolidayDisplayName(day, locale);
      if (holidayName) {
        const hol = document.createElement('span');
        hol.className = 'mt-1 block text-[0.6rem] leading-tight text-wood-mid';
        hol.textContent = holidayName;
        th.append(hol);
      }
      theadRow.append(th);
    });

    tbody.innerHTML = '';
    week.hours.forEach((hour, rowIndex) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-gold-soft/40';
      const th = document.createElement('th');
      th.className =
        'sticky left-0 z-10 min-w-[3.5rem] bg-surface-elevated px-2 py-2 text-left text-xs font-medium text-wood-mid shadow-[4px_0_8px_-4px_rgba(44,33,24,0.12)]';
      th.scope = 'row';
      th.textContent = hour;
      tr.append(th);
      week.cells[rowIndex]?.forEach((cell, colIndex) => {
        const day = week.days[colIndex];
        const td = document.createElement('td');
        td.className = scheduleCellClass(day, cell.clickable);
        td.dataset.slotDate = cell.date;
        td.dataset.slotHour = cell.hour;
        td.dataset.slotKind = cell.kind;
        td.dataset.slotClickable = cell.clickable ? 'true' : 'false';
        td.setAttribute('aria-label', `${cell.date} ${cell.hour} ${cell.symbol}`);
        td.textContent = cell.symbol;
        tr.append(td);
      });
      tbody.append(tr);
    });
  };

  root.querySelector('[data-week-prev]')?.addEventListener('click', () => {
    weekStart = addDays(weekStart, -7);
    render();
  });
  root.querySelector('[data-week-next]')?.addEventListener('click', () => {
    weekStart = addDays(weekStart, 7);
    render();
  });

  tbody.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const cell = target.closest('[data-slot-clickable="true"]');
    if (!(cell instanceof HTMLElement)) return;
    const date = cell.dataset.slotDate;
    const hour = cell.dataset.slotHour;
    if (!date || !hour) return;

    document.getElementById('book-online')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (googleFormUrl) {
      try {
        const url = new URL(googleFormUrl);
        url.searchParams.set('entry.date', date);
        url.searchParams.set('entry.time', hour);
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
      } catch {
        window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
      }
    }
  });
}

const root = document.getElementById('reserve-schedule');
if (root) initReserveSchedule(root);
