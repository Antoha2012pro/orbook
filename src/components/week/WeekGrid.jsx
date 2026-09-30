import { addDays, isSameDay } from "date-fns";
import { periods, getDayLessons } from "../../shared/data/timetable";
import { getNowPosition, isPeriodPast } from "../../shared/utils/time";
import { useNow } from "../../shared/hooks/useNow";
import DayHeader from "./DayHeader";
import LessonCell from "./LessonCell";
import NowLine from "./NowLine";

const WeekGrid = ({ weekStart, onDayClick }) => {
  const now = useNow();
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const todayIndex = days.findIndex((d) => isSameDay(d, now));
  const nowPos = todayIndex >= 0 ? getNowPosition(periods, now) : null;

  return (
    <div className="grid grid-cols-[32px_repeat(5,minmax(0,1fr))] gap-1">
      {/* ── шапка с днями ── */}
      {days.map((day, di) => (
        <DayHeader
          key={day.toISOString()}
          style={{ gridRow: 1, gridColumn: di + 2 }}
          day={day}
          isToday={di === todayIndex}
          hasExam={getDayLessons(day).some((l) => l?.exam)}
          onClick={() => onDayClick(day)}
        />
      ))}

      {/* ── номера уроков слева ── */}
      {periods.map((p, pi) => (
        <div
          key={p.n}
          style={{ gridRow: pi + 2, gridColumn: 1 }}
          className="flex flex-col items-center justify-center gap-px"
        >
          <span className="text-[15px] leading-none font-extrabold text-ink">{p.n}</span>
          <span className="text-[9px] leading-none font-medium text-faint">{p.start}</span>
        </div>
      ))}

      {/* ── уроки ── */}
      {days.map((day, di) => {
        const lessons = getDayLessons(day);
        return periods.map((p, pi) => (
          <LessonCell
            key={`${di}-${pi}`}
            style={{ gridRow: pi + 2, gridColumn: di + 2 }}
            lesson={lessons[pi]}
            isPast={isPeriodPast(p, day, now)}
          />
        ));
      })}

      {/* ── линия «сейчас» ── */}
      {nowPos && (
        <NowLine row={nowPos.index + 2} progress={nowPos.progress} todayIndex={todayIndex} />
      )}
    </div>
  );
};

export default WeekGrid;