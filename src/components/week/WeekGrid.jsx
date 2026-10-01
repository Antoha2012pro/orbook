import { addDays, isSameDay } from "date-fns";
import { periods, getDayLessons } from "../../shared/data/timetable";
import { getNowPosition, isPeriodPast } from "../../shared/utils/time";
import { useNow } from "../../shared/hooks/useNow";
import { useUserStore } from "../../shared/store/userStore";
import { applyHidden } from "../../shared/utils/lessons";
import { toISODate } from "../../shared/utils/dates";
import LessonContextMenu from "../lesson/LessonContextMenu";
import DayHeader from "./DayHeader";
import LessonCell from "./LessonCell";
import NowLine from "./NowLine";

// Сетка недели. onLessonClick(day, index) — клик по уроку
const WeekGrid = ({ weekStart, onLessonClick }) => {
  const now = useNow(); // текущее время (обновляется раз в минуту)
  const showWeekend = useUserStore((s) => s.showWeekend); // показывать ли Sa/So
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета

  const dayCount = showWeekend ? 7 : 5; // сколько колонок-дней
  const days = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i)); // даты колонок
  const todayIndex = days.findIndex((d) => isSameDay(d, now)); // колонка сегодняшнего дня (-1, если не эта неделя)
  const nowPos = todayIndex >= 0 ? getNowPosition(periods, now) : null; // где линия «сейчас»

  return (
    <div
      className="grid gap-1"
      // 32px под номера уроков + равные колонки под дни
      style={{ gridTemplateColumns: `32px repeat(${dayCount}, minmax(0, 1fr))` }}
    >
      {/* ── шапка с днями ── */}
      {days.map((day, di) => (
        <DayHeader
          key={day.toISOString()}
          style={{ gridRow: 1, gridColumn: di + 2 }}
          day={day}
          to={`/tag/${toISODate(day)}`} // ссылка на страницу дня
          isToday={di === todayIndex}
          hasExam={getDayLessons(day).some((l) => l?.exam)}
        />
      ))}

      {/* ── номера уроков слева ── */}
      {periods.map((p, pi) => (
        <div
          key={p.n}
          style={{ gridRow: pi + 2, gridColumn: 1 }}
          className="flex flex-col items-center justify-center gap-px"
        >
          <span className="text-body leading-none font-extrabold text-ink">{p.n}</span>
          <span className="text-tiny leading-none font-medium text-faint">{p.start}</span>
        </div>
      ))}

      {/* ── уроки ── */}
      {days.map((day, di) => {
        const lessons = applyHidden(getDayLessons(day), hiddenCourses); // уроки дня без скрытых курсов
        return periods.map((p, pi) => {
          const lesson = lessons[pi]; // урок в этой ячейке (или null)
          const style = { gridRow: pi + 2, gridColumn: di + 2 }; // место в сетке
          const isPast = isPeriodPast(p, day, now); // уже прошёл?

          // Пустая ячейка — без меню и клика
          if (!lesson) return <LessonCell key={`${di}-${pi}`} style={style} />;

          return (
            <LessonContextMenu key={`${di}-${pi}`} lesson={lesson} date={day} index={pi}>
              <LessonCell
                style={style}
                lesson={lesson}
                isPast={isPast}
                overrides={overrides}
                onClick={() => onLessonClick(day, pi)}
              />
            </LessonContextMenu>
          );
        });
      })}

      {/* ── линия «сейчас» ── */}
      {nowPos && (
        <NowLine row={nowPos.index + 2} progress={nowPos.progress} todayIndex={todayIndex} dayCount={dayCount} />
      )}
    </div>
  );
};

export default WeekGrid;
