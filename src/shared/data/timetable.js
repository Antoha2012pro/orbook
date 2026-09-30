import { addDays, getISODay, isSameDay, startOfDay } from "date-fns";

export const periods = [
  { n: 1, start: "07:30", end: "08:15" },
  { n: 2, start: "08:20", end: "09:05" },
  { n: 3, start: "09:25", end: "10:10" },
  { n: 4, start: "10:30", end: "11:15" },
  { n: 5, start: "11:35", end: "12:20" },
  { n: 6, start: "12:25", end: "13:10" },
];

// Пока одна и та же неделя. Потом заменишь на данные с сервера —
// поменяется только getDayLessons, остальной код не трогаешь.
const week = [
  [
    { fach: "deutsch", short: "De", room: "102" },
    { fach: "mathe", short: "Ma", room: "108" },
    { fach: "englisch", short: "En", room: "210" },
    { fach: "sport", short: "Sp", room: "Halle" },
    { fach: "geschichte", short: "Ge", room: "108" },
    { fach: "biologie", short: "Bio", room: "305" },
  ],
  [
    { fach: "mathe", short: "Ma", room: "108" },
    { fach: "physik", short: "Ph", room: "301" },
    { fach: "deutsch", short: "De", room: "102" },
    { fach: "englisch", short: "En", status: "cancelled" },
    { fach: "kunst", short: "Ku", room: "012" },
    null,
  ],
  [
    { fach: "deutsch", short: "De", room: "102" },
    { fach: "mathe", short: "Ma", room: "204", status: "changed" },
    { fach: "englisch", short: "En", status: "cancelled" },
    { fach: "physik", short: "Ph", room: "301" },
    { fach: "geschichte", short: "Ge", room: "108" },
    { fach: "sport", short: "Sp", room: "Halle" },
  ],
  [
    { fach: "deutsch", short: "De", room: "102" },
    { fach: "mathe", short: "Ma", room: "108" },
    { fach: "physik", short: "Ph", room: "301" },
    { fach: "geschichte", short: "Ge", room: "B12", status: "changed" },
    { fach: "sport", short: "Sp", room: "Halle" },
    { fach: "englisch", short: "En", room: "210" },
  ],
  [
    { fach: "mathe", short: "Ma", room: "108", exam: true, topic: "Quadratische Funktionen" },
    { fach: "englisch", short: "En", room: "210" },
    { fach: "deutsch", short: "De", room: "102" },
    { fach: "biologie", short: "Bio", room: "305" },
    { fach: "geschichte", short: "Ge", room: "108" },
    null,
  ],
];

// Уроки конкретного дня: массив длиной periods.length (null — урока нет).
// Выходные — пустой массив.
export const getDayLessons = (date) => {
  const weekday = getISODay(date); // 1 = Mo … 7 = So
  if (weekday > 5) return [];
  return week[weekday - 1];
};

// Сколько за неделю отменено и сколько замен
export const getWeekStats = (days) => {
  const lessons = days.flatMap(getDayLessons).filter(Boolean);
  return {
    cancelled: lessons.filter((l) => l.status === "cancelled").length,
    changed: lessons.filter((l) => l.status === "changed").length,
  };
};

// Ближайшая Klausur, начиная с сегодняшнего дня (ищем на 4 недели вперёд)
export const getNextExam = (now) => {
  const today = startOfDay(now);
  for (let i = 0; i < 28; i++) {
    const date = addDays(today, i);
    const lesson = getDayLessons(date).find((l) => l?.exam);
    if (lesson) return { date, lesson, isToday: isSameDay(date, now) };
  }
  return null;
};