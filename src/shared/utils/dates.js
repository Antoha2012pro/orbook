import { addDays, differenceInCalendarDays, format, isValid, isWeekend, parseISO } from "date-fns";
import { de } from "date-fns/locale";

// Date → "2025-09-17" (формат для адресов /tag/2025-09-17)
export const toISODate = (date) => format(date, "yyyy-MM-dd");

// "2025-09-17" → Date, или null, если строка кривая
export const parseISODate = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; // проверяем формат
  const date = parseISO(value); // превращаем в Date
  return isValid(date) ? date : null; // например, 2025-02-31 — невалидная дата
};

// format с немецкой локалью: formatDe(date, "EEEE") → "Mittwoch"
export const formatDe = (date, pattern) => format(date, pattern, { locale: de });

// "heute" / "morgen" / "gestern" или null, если день дальше
export const relativeDayWord = (date, now) => {
  const diff = differenceInCalendarDays(date, now); // разница в днях по календарю
  if (diff === 0) return "heute";
  if (diff === 1) return "morgen";
  if (diff === -1) return "gestern";
  return null;
};

// "heute" / "morgen" / "in 2 Tagen" / "vor 3 Tagen"
export const relativeDays = (date, now) => {
  const diff = differenceInCalendarDays(date, now); // разница в днях
  const word = relativeDayWord(date, now); // heute/morgen/gestern
  if (word) return word;
  return diff > 0 ? `in ${diff} Tagen` : `vor ${-diff} Tagen`;
};

// Следующий (step = 1) или предыдущий (step = -1) учебный день, пропуская Sa/So
export const shiftSchoolDay = (date, step) => {
  let next = addDays(date, step); // шаг на день
  while (isWeekend(next)) next = addDays(next, step); // выходные перескакиваем
  return next;
};
