import { isSameDay } from "date-fns";
import { periods } from "../../shared/data/timetable";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { fachClasses, fachName } from "../../shared/utils/lessons";
import { isPeriodPast, minutesOfDay, toMinutes } from "../../shared/utils/time";
import StatusBadge from "../ui/StatusBadge";
import LessonContextMenu from "../lesson/LessonContextMenu";

const PX_PER_MIN = 1.3; // сколько пикселей высоты на одну минуту
const AXIS = 48; // ширина колонки с часами слева (px)

// ─────────────────────────────────────────────────────────────
// Вид «Zeitleiste» (скрин 2): уроки как блоки на шкале времени.
// Высота блока = длительность урока, отступ сверху = время начала.
// ─────────────────────────────────────────────────────────────
const Timeline = ({ date, lessons, now, onOpen }) => {
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета

  // Уроки, которые есть
  const items = periods
    .map((period, index) => ({ period, index, lesson: lessons[index] }))
    .filter((item) => item.lesson);

  const dayStart = toMinutes(items[0].period.start); // начало первого урока (минуты)
  const dayEnd = toMinutes(items[items.length - 1].period.end); // конец последнего
  const y = (minutes) => (minutes - dayStart) * PX_PER_MIN; // минуты → пиксели сверху

  // Целые часы внутри дня (8:00, 9:00 …) для подписей слева
  const hours = [];
  for (let h = Math.ceil(dayStart / 60); h * 60 <= dayEnd; h++) hours.push(h);

  // Линия «сейчас» — только сегодня и только во время уроков
  const nowMin = minutesOfDay(now);
  const showNow = isSameDay(date, now) && nowMin >= dayStart && nowMin <= dayEnd;

  return (
    <div className="relative" style={{ height: y(dayEnd) + 8 }}>
      {/* подписи часов */}
      {hours.map((h) => (
        <span
          key={h}
          className="absolute left-0 -translate-y-1/2 text-right text-small font-bold text-faint"
          style={{ top: y(h * 60), width: AXIS - 12 }}
        >
          {h}:00
        </span>
      ))}

      {/* блоки уроков */}
      {items.map(({ period, index, lesson }, k) => {
        const start = toMinutes(period.start); // начало
        const end = toMinutes(period.end); // конец
        const prevEnd = k > 0 ? toMinutes(items[k - 1].period.end) : start; // конец предыдущего урока
        const gap = start - prevEnd; // перемена перед уроком
        const isCancelled = lesson.status === "cancelled";

        return (
          <div key={period.n}>
            {/* подпись перемены посередине промежутка */}
            {gap >= 10 && (
              <span
                className="absolute right-0 -translate-y-1/2 text-center text-micro font-bold text-faint"
                style={{ top: y(prevEnd + gap / 2), left: AXIS }}
              >
                Pause · {gap} min
              </span>
            )}

            <LessonContextMenu lesson={lesson} date={date} index={index}>
              <button
                type="button"
                onClick={() => onOpen(index)}
                className={cn(
                  "absolute right-0 flex flex-col justify-between overflow-hidden rounded-2xl px-3 py-2 text-left select-none [-webkit-touch-callout:none]",
                  isCancelled ? "border-[1.5px] border-dashed border-faint2 bg-paper text-faint" : fachClasses(lesson.fach, overrides),
                  lesson.status === "changed" && "ring-2 ring-accent ring-inset",
                  isPeriodPast(period, date, now) && "opacity-50",
                )}
                style={{ top: y(start), height: (end - start) * PX_PER_MIN, left: AXIS }} // позиция по времени
              >
                <div className="flex items-center gap-2">
                  <span className={cn("truncate text-body-sm font-extrabold", isCancelled && "line-through")}>
                    {fachName(lesson.fach)}
                  </span>
                  <StatusBadge lesson={lesson} />
                  <span className="ml-auto shrink-0 text-small font-bold opacity-70">
                    {period.start}–{period.end}
                  </span>
                </div>
                <p className="truncate text-caption font-bold opacity-80">
                  {isCancelled ? lesson.info ?? "fällt aus" : `${lesson.teacher} · ${lesson.room}`}
                </p>
              </button>
            </LessonContextMenu>
          </div>
        );
      })}

      {/* линия «сейчас»: время в фиолетовой плашке + линия */}
      {showNow && (
        <div className="pointer-events-none absolute inset-x-0 z-10 flex -translate-y-1/2 items-center" style={{ top: y(nowMin) }}>
          <span className="rounded-md bg-accent px-1.5 py-0.5 text-micro font-extrabold text-on-accent">
            {String(now.getHours()).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}
          </span>
          <span className="size-2 shrink-0 rounded-full bg-accent" />
          <span className="h-0.5 flex-1 bg-accent" />
        </div>
      )}
    </div>
  );
};

export default Timeline;
