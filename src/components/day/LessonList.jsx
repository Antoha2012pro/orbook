import { Fragment } from "react";
import { periods } from "../../shared/data/timetable";
import { useUserStore } from "../../shared/store/userStore";
import { isPeriodNow, isPeriodPast, minutesOfDay, toMinutes } from "../../shared/utils/time";
import { toISODate } from "../../shared/utils/dates";
import BreakRow from "./BreakRow";
import LessonRow from "./LessonRow";

// Перемены короче этого не показываем (5-минутные между уроками)
const MIN_BREAK = 10;

// ─────────────────────────────────────────────────────────────
// Вид «Liste»: уроки дня сверху вниз + перемены между ними.
// onOpen(index) — клик по уроку
// ─────────────────────────────────────────────────────────────
const LessonList = ({ date, lessons, now, onOpen }) => {
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета
  const notes = useUserStore((s) => s.notes); // все заметки (фильтруем ниже)
  const iso = toISODate(date); // "2025-09-17"

  // Только те уроки, что есть (пустые места пропускаем)
  const items = periods
    .map((period, index) => ({ period, index, lesson: lessons[index] }))
    .filter((item) => item.lesson);

  return (
    <div className="flex flex-col gap-2.5">
      {items.map(({ period, index, lesson }, k) => {
        // Перемена перед уроком: начало этого − конец предыдущего
        const gap = k > 0 ? toMinutes(period.start) - toMinutes(items[k - 1].period.end) : 0;

        // Идёт ли урок сейчас → сколько осталось и какая доля прошла
        const running = isPeriodNow(period, date, now) && lesson.status !== "cancelled";
        const live = running
          ? {
              minutesLeft: toMinutes(period.end) - minutesOfDay(now),
              progress: (minutesOfDay(now) - toMinutes(period.start)) / (toMinutes(period.end) - toMinutes(period.start)),
            }
          : null;

        return (
          <Fragment key={period.n}>
            {gap >= MIN_BREAK && <BreakRow minutes={gap} />}
            <LessonRow
              lesson={lesson}
              period={period}
              index={index}
              date={date}
              isPast={isPeriodPast(period, date, now)}
              live={live}
              note={notes.find((n) => n.id === `${iso}#${period.n}`)} // заметка к этому уроку
              overrides={overrides}
              onOpen={() => onOpen(index)}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default LessonList;
