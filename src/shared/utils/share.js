import { addDays, getISOWeek, isSameDay, isWeekend, startOfDay, startOfISOWeek } from "date-fns";
import { toast } from "sonner";
import { SCHOOL_CLASS, getDayLessons, periods } from "../data/timetable";
import { fachName } from "./lessons";
import { formatDe } from "./dates";

// Подпись в конце каждого сообщения
const SIGNATURE = "via ORBook";

// Одна строка про изменение урока: "4. Std Geschichte → Vertretung, Raum B12"
const changeLine = (lesson, period) => {
  const base = `${period.n}. Std ${fachName(lesson.fach)}`; // "4. Std Geschichte"
  if (lesson.status === "cancelled") return `${base} fällt aus`; // отмена
  return `${base} → Vertretung, Raum ${lesson.room}`; // замена
};

// Текст для шторки «Teilen».
// range: "heute" | "morgen" | "woche"; weekStart — понедельник показываемой недели
export const buildShareText = ({ range, includeChanges, includeExams, now, weekStart }) => {
  const today = startOfDay(now); // полночь сегодня
  let days; // дни, про которые пишем
  let title; // первая строка

  if (range === "woche") {
    const monday = startOfISOWeek(weekStart ?? today); // понедельник недели
    days = Array.from({ length: 5 }, (_, i) => addDays(monday, i)); // Mo–Fr
    title = `KW ${getISOWeek(monday)} bei der ${SCHOOL_CLASS}:`; // "KW 38 bei der 9b:"
  } else {
    const day = range === "morgen" ? addDays(today, 1) : today; // сегодня или завтра
    days = [day];
    const word = range === "morgen" ? "Morgen" : "Heute"; // слово в заголовке
    title = `${word} (${formatDe(day, "EEEEEE")}) bei der ${SCHOOL_CLASS}:`; // "Morgen (Do) bei der 9b:"
  }

  const lines = []; // строки сообщения

  // Изменения (Vertretungen и отмены)
  if (includeChanges) {
    days.forEach((day) => {
      getDayLessons(day).forEach((lesson, i) => {
        if (!lesson?.status) return; // урок без изменений пропускаем
        const prefix = days.length > 1 ? `${formatDe(day, "EEEEEE")} ` : ""; // в режиме недели — день впереди
        lines.push(`• ${prefix}${changeLine(lesson, periods[i])}`);
      });
    });
  }

  // Klausuren: от первого дня периода и на неделю вперёд
  if (includeExams) {
    for (let i = 0; i < 7; i++) {
      const day = addDays(days[0], i); // проверяемый день
      if (isWeekend(day)) continue; // в выходные уроков нет
      getDayLessons(day).forEach((lesson, index) => {
        if (!lesson?.exam) return; // не Klausur
        const when = isSameDay(day, today) ? "Heute" : formatDe(day, "EEEEEE"); // "Fr" или "Heute"
        const type = lesson.examType === "test" ? "Test" : "Klausur"; // Test или Klausur
        lines.push(`• ${when} ${periods[index].n}. Std: ${type} ${fachName(lesson.fach)}`);
      });
    }
  }

  if (lines.length === 0) lines.push("• Keine Änderungen"); // нечего сообщать

  return [title, ...lines, SIGNATURE].join("\n"); // склеиваем в один текст
};

// Текст про один урок (для «Teilen» в шторке урока и в меню)
export const buildLessonText = (lesson, date, period) => {
  const lines = [
    `${formatDe(date, "EEEEEE, d.M.")} · ${period.n}. Std ${fachName(lesson.fach)} (${period.start}–${period.end})`,
  ];
  if (lesson.status === "cancelled") lines.push("Fällt aus"); // отмена
  if (lesson.status === "changed") {
    // что поменялось: учитель и/или кабинет
    const parts = [];
    if (lesson.originalTeacher) parts.push(`${lesson.teacher} statt ${lesson.originalTeacher}`);
    if (lesson.originalRoom) parts.push(`Raum ${lesson.room} statt ${lesson.originalRoom}`);
    lines.push(`Vertretung: ${parts.join(", ") || `Raum ${lesson.room}`}`);
  }
  if (lesson.status !== "changed" && lesson.status !== "cancelled") lines.push(`Raum ${lesson.room} · ${lesson.teacher}`);
  if (lesson.exam) lines.push(`${lesson.examType === "test" ? "Test" : "Klausur"}${lesson.topic ? `: ${lesson.topic}` : ""}`); // Klausur/Test и тема
  if (lesson.info) lines.push(lesson.info); // пояснение
  lines.push(SIGNATURE);
  return lines.join("\n");
};

// Скопировать текст в буфер обмена с уведомлением
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text); // пишем в буфер
    toast.success("Kopiert"); // уведомление
  } catch {
    toast.error("Kopieren nicht möglich"); // браузер запретил доступ к буферу
  }
};

// Поделиться: системное меню (телефон) или копирование (если меню нет)
export const shareText = async (text) => {
  if (navigator.share) {
    try {
      await navigator.share({ text }); // системное «Поделиться»
      return;
    } catch (error) {
      if (error.name === "AbortError") return; // пользователь закрыл меню — это не ошибка
    }
  }
  await copyText(text); // запасной вариант — копируем
};

// Ссылка, которая открывает WhatsApp с готовым текстом
export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
