import { addDays, format, getISODay, isSameDay, startOfDay } from "date-fns";

// Класс пользователя — используется в тексте «Teilen» («… bei der 9b»)
export const SCHOOL_CLASS = "9b";

// Время уроков (n — номер урока)
export const periods = [
  { n: 1, start: "07:30", end: "08:15" },
  { n: 2, start: "08:20", end: "09:05" },
  { n: 3, start: "09:25", end: "10:10" },
  { n: 4, start: "10:30", end: "11:15" },
  { n: 5, start: "11:35", end: "12:20" },
  { n: 6, start: "12:25", end: "13:10" },
];

// Учитель и курс по умолчанию для каждого предмета
const defaults = {
  deutsch: { short: "De", teacher: "Web", course: "De-9b" },
  mathe: { short: "Ma", teacher: "Mü", course: "GK-Ma1" },
  englisch: { short: "En", teacher: "Sch", course: "En-9b" },
  physik: { short: "Ph", teacher: "Ric", course: "Ph-9b" },
  geschichte: { short: "Ge", teacher: "Bau", course: "Ge-9b" },
  kunst: { short: "Ku", teacher: "Lan", course: "Ku-9b" },
  sport: { short: "Sp", teacher: "Hen", course: "Sp-9b" },
  biologie: { short: "Bio", teacher: "Kor", course: "Bio-9b" },
};

// Короткая запись урока: L("mathe", "108", { ...доп. поля })
const L = (fach, room, extra = {}) => ({ fach, room, ...defaults[fach], ...extra });

// ─────────────────────────────────────────────────────────────
// ЗАГЛУШКА: одна и та же неделя. Потом эти данные придут с сервера —
// поменяется только getDayLessons (и getDayInfo), компоненты не трогаешь.
//
// Поля урока:
//   status: "cancelled" — fällt aus, "changed" — Vertretung (замена)
//   originalTeacher / originalRoom — что было до замены (зачёркивается)
//   exam: true — Klausur, topic — тема Klausur
//   info — пояснение (домашка, причина отмены и т.п.)
// ─────────────────────────────────────────────────────────────
const week = [
  // Montag
  [L("deutsch", "102"), L("mathe", "108"), L("englisch", "210"), L("sport", "Halle"), L("geschichte", "108"), L("biologie", "305")],
  // Dienstag
  [
    L("mathe", "108"),
    L("physik", "301"),
    L("deutsch", "102"),
    L("englisch", "210", { status: "cancelled", info: "Lehrer krank" }),
    L("kunst", "012"),
    null, // 6. урока нет
  ],
  // Mittwoch
  [
    L("deutsch", "102"),
    L("mathe", "204", { status: "changed", teacher: "Kle", originalTeacher: "Mü", originalRoom: "108", info: "Aufgaben im Buch S. 54" }),
    L("englisch", "210", { status: "cancelled", info: "Lehrer krank" }),
    L("physik", "301"),
    L("geschichte", "108", { info: "Atlas mitbringen" }),
    L("sport", "Halle"),
  ],
  // Donnerstag
  [
    L("deutsch", "102"),
    L("mathe", "108"),
    L("physik", "301"),
    L("geschichte", "B12", { status: "changed", originalRoom: "108" }),
    L("sport", "Halle"),
    L("englisch", "210"),
  ],
  // Freitag
  [
    L("mathe", "108", { exam: true, topic: "Quadratische Funktionen" }),
    L("englisch", "210"),
    L("deutsch", "102"),
    L("biologie", "305"),
    L("geschichte", "108"),
    null, // 6. урока нет
  ],
];

// ЗАГЛУШКА: «Info zum Tag» по дню недели (3 = Mittwoch)
const dayInfos = {
  3: {
    short: "Elternabend der 9b heute um 18:00 in Raum 102.", // текст для плашки
    paragraphs: [
      "Elternabend der 9b heute um 18:00 in Raum 102.", // абзацы для шторки
      "Die Bibliothek bleibt ab 13:00 geschlossen.",
      "Frau Kle vertritt Herrn Mü bis Freitag.",
    ],
    source: "Aus dem Vertretungsplan der Schule, Stand 07:12.", // откуда информация
  },
};

// ЗАГЛУШКА: Feiertage (месяц-день → название), повторяются каждый год
const holidays = {
  "01-01": "Neujahr",
  "05-01": "Tag der Arbeit",
  "10-03": "Tag der Deutschen Einheit",
  "12-25": "1. Weihnachtstag",
  "12-26": "2. Weihnachtstag",
};

// Название праздника в этот день или null
export const getHoliday = (date) => holidays[format(date, "MM-dd")] ?? null;

// Уроки дня: массив длиной periods.length (null — урока нет).
// Выходные и праздники — пустой массив.
export const getDayLessons = (date) => {
  if (getHoliday(date)) return []; // праздник — уроков нет
  const weekday = getISODay(date); // 1 = Mo … 7 = So
  if (weekday > 5) return []; // выходной
  return week[weekday - 1]; // уроки этого дня недели
};

// «Info zum Tag» для даты или null
export const getDayInfo = (date) => {
  if (getHoliday(date)) return null; // в праздник информации нет
  return dayInfos[getISODay(date)] ?? null; // по дню недели
};

// Сколько за неделю отменено и сколько замен
export const getWeekStats = (days) => {
  const lessons = days.flatMap(getDayLessons).filter(Boolean); // все уроки недели без пустых
  return {
    cancelled: lessons.filter((l) => l.status === "cancelled").length, // fällt aus
    changed: lessons.filter((l) => l.status === "changed").length, // Vertretungen
  };
};

// Ближайшая Klausur, начиная с сегодняшнего дня (ищем на 4 недели вперёд)
export const getNextExam = (now) => {
  const today = startOfDay(now); // полночь сегодня
  for (let i = 0; i < 28; i++) {
    const date = addDays(today, i); // проверяемый день
    const lessons = getDayLessons(date); // уроки этого дня
    const index = lessons.findIndex((l) => l?.exam); // индекс урока с Klausur
    if (index >= 0) {
      return { date, lesson: lessons[index], period: periods[index], isToday: isSameDay(date, now) };
    }
  }
  return null; // Klausur не найдена
};
