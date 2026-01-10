import { DateTime } from 'luxon';

export const MOSCOW_TZ = 'Europe/Moscow';

export function parseMoscowDate(yyyyMmDd: string): DateTime {
  const dt = DateTime.fromISO(yyyyMmDd, { zone: MOSCOW_TZ });
  return dt.isValid ? dt.startOf('day') : dt;
}

