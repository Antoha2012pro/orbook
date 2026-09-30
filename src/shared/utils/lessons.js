import { fachColors, fachNames, fachSolid } from "../constants/fachColors";
import { periods } from "../data/timetable";
import { minutesOfDay, toMinutes } from "./time";

// Убираем уроки скрытых курсов (на их месте — пустая ячейка)
export const applyHidden = (lessons, hiddenCourses) =>
  lessons.map((lesson) => (lesson && hiddenCourses.includes(lesson.course) ? null : lesson));

// Классы плашки предмета с учётом своего цвета пользователя
export const fachClasses = (fach, overrides) => fachColors[overrides?.[fach] ?? fach];

// Насыщенный цвет предмета с учётом своего цвета
export const fachSolidClass = (fach, overrides) => fachSolid[overrides?.[fach] ?? fach];

// Полное название предмета: "mathe" → "Mathe"
export const fachName = (fach) => fachNames[fach] ?? fach;

// Надпись для бейджа урока или null
export const statusBadge = (lesson) => {
  if (lesson.status === "cancelled") return "fällt aus";
  if (lesson.exam) return "Klausur";
  if (lesson.status === "changed") return "Vertretung";
  return null;
};

// Что происходит сейчас в этот день (день должен быть сегодняшним).
// Возвращает:
//   { kind: "running", current, next, minutesLeft, progress, breakAfter } — идёт урок
//   { kind: "break" | "before", next, minutesLeft } — перемена / уроки ещё не начались
//   { kind: "done" } — уроки закончились
//   null — уроков нет
// current / next = { lesson, period, index }
export const getLiveStatus = (lessons, now) => {
  const nowMin = minutesOfDay(now); // сейчас в минутах от полуночи
  // Только настоящие уроки (без пустых и отменённых)
  const items = periods
    .map((period, index) => ({ period, index, lesson: lessons[index] }))
    .filter((item) => item.lesson && item.lesson.status !== "cancelled");

  if (items.length === 0) return null; // уроков нет

  for (let k = 0; k < items.length; k++) {
    const start = toMinutes(items[k].period.start); // начало урока
    const end = toMinutes(items[k].period.end); // конец урока

    // Урок ещё не начался — значит, сейчас перемена (или утро)
    if (nowMin < start) {
      return { kind: k === 0 ? "before" : "break", next: items[k], minutesLeft: start - nowMin };
    }

    // Урок идёт прямо сейчас
    if (nowMin < end) {
      const next = items[k + 1] ?? null; // следующий урок
      return {
        kind: "running",
        current: items[k],
        next,
        minutesLeft: end - nowMin, // сколько осталось
        progress: (nowMin - start) / (end - start), // доля прошедшего времени (0…1)
        breakAfter: next ? toMinutes(next.period.start) - end : 0, // длина перемены после урока
      };
    }
  }

  return { kind: "done" }; // все уроки уже прошли
};
