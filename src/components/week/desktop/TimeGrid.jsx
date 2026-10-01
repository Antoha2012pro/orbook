import { Link } from "react-router-dom";
import { addDays, isSameDay } from "date-fns";
import { getDayLessons, periods } from "../../../shared/data/timetable";
import { useNow } from "../../../shared/hooks/useNow";
import { useUserStore } from "../../../shared/store/userStore";
import { cn } from "../../../shared/utils/cn";
import { toISODate } from "../../../shared/utils/dates";
import { applyHidden } from "../../../shared/utils/lessons";
import { isPeriodPast, minutesOfDay, toMinutes } from "../../../shared/utils/time";
import LessonContextMenu from "../../lesson/LessonContextMenu";
import LessonTooltip from "../../lesson/LessonTooltip";
import DesktopLessonCard from "./DesktopLessonCard";
import GridDayHeader from "./GridDayHeader";

const PX_PER_MIN = 1.85; // пикселей на минуту (на макете час = 111px)
const LABEL_COL = 50; // ширина колонки с часами слева (px)
const CARD_GAP = 3; // отступ карточки сверху и снизу внутри своего времени (px)

// ─────────────────────────────────────────────────────────────
// Вид недели «Zeitraster» (макет «Woche · Zeitraster + Seitenspalte»):
// дни — колонки, уроки стоят по времени (высота = длительность),
// слева часы, горизонтальные линии на каждый час, линия «сейчас».
// onLessonClick(day, index) — клик по уроку
// ─────────────────────────────────────────────────────────────
const TimeGrid = ({ weekStart, dayCount, onLessonClick }) => {
  const now = useNow(); // текущее время
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета

  const days = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i)); // колонки
  const todayIndex = days.findIndex((d) => isSameDay(d, now)); // колонка «сегодня» (-1 — не эта неделя)

  const dayStart = toMinutes(periods[0].start); // начало первого урока (07:30)
  const dayEnd = toMinutes(periods[periods.length - 1].end); // конец последнего (13:10)
  const y = (minutes) => (minutes - dayStart) * PX_PER_MIN; // минуты → пиксели сверху
  const height = y(dayEnd) + 12; // высота области с уроками (+ запас снизу)

  // Целые часы для линий и подписей (8:00 … 13:00)
  const hours = [];
  for (let h = Math.ceil(dayStart / 60); h * 60 <= dayEnd; h++) hours.push(h);

  // Линия «сейчас»: только на неделе с сегодняшним днём и во время уроков
  const nowMin = minutesOfDay(now);
  const showNow = todayIndex >= 0 && nowMin >= dayStart && nowMin <= dayEnd;

  // Одинаковые колонки для всех слоёв (часы + дни), между днями 10px
  const columns = { gridTemplateColumns: `${LABEL_COL}px repeat(${dayCount}, minmax(0, 1fr))`, columnGap: 10 };

  return (
    <div className="grid" style={{ ...columns, rowGap: 10 }}>
      {/* ── шапка: дни недели (ссылка на страницу дня) ── */}
      {days.map((day, di) => (
        <GridDayHeader
          key={day.toISOString()}
          as={Link}
          to={`/tag/${toISODate(day)}`}
          day={day}
          isToday={di === todayIndex}
          style={{ gridRow: 1, gridColumn: di + 2 }}
        />
      ))}

      {/* ── слой 1: подписи часов и горизонтальные линии (на всю ширину) ── */}
      <div className="pointer-events-none relative" style={{ gridRow: 2, gridColumn: "1 / -1", height }}>
        {hours.map((h) => (
          <div key={h} className="absolute inset-x-0" style={{ top: y(h * 60) }}>
            {/* «8:00» справа в колонке часов */}
            <span className="absolute -translate-y-1/2 pr-2.5 text-right text-small font-semibold text-faint" style={{ width: LABEL_COL }}>
              {h}:00
            </span>
            {/* линия от колонки часов до правого края */}
            <span className="absolute right-0 h-px bg-rule" style={{ left: LABEL_COL }} />
          </div>
        ))}
      </div>

      {/* ── слой 2: колонки дней с уроками ── */}
      {days.map((day, di) => {
        const lessons = applyHidden(getDayLessons(day), hiddenCourses); // уроки дня без скрытых курсов
        return (
          <div
            key={day.toISOString()}
            // сегодняшняя колонка — песочный фон под уроками (как на макете)
            className={cn("relative rounded-2xl", di === todayIndex && "bg-sand/70")}
            style={{ gridRow: 2, gridColumn: di + 2, height }}
          >
            {periods.map((period, index) => {
              const lesson = lessons[index]; // урок в этот период
              if (!lesson) return null; // пусто — ничего не рисуем
              const start = toMinutes(period.start);
              const end = toMinutes(period.end);
              return (
                // правый клик → меню; наведение → подсказка; клик → панель урока
                <LessonContextMenu key={period.n} lesson={lesson} date={day} index={index}>
                  <LessonTooltip lesson={lesson} period={period}>
                    <DesktopLessonCard
                      lesson={lesson}
                      overrides={overrides}
                      isPast={isPeriodPast(period, day, now)}
                      onClick={() => onLessonClick(day, index)}
                      className="absolute inset-x-[3px]"
                      // позиция по времени: сверху — начало урока, высота — длительность
                      style={{ top: y(start) + CARD_GAP, height: (end - start) * PX_PER_MIN - CARD_GAP * 2 }}
                    />
                  </LessonTooltip>
                </LessonContextMenu>
              );
            })}
          </div>
        );
      })}

      {/* ── слой 3: линия «сейчас» ── */}
      {showNow && (
        <div className="pointer-events-none relative z-10" style={{ gridRow: 2, gridColumn: "1 / -1", height }}>
          <div className="absolute inset-x-0" style={{ top: y(nowMin) }}>
            {/* время в фиолетовой плашке слева */}
            <span className="absolute left-0 -translate-y-1/2 rounded-md bg-accent px-1.75 py-0.5 text-small font-extrabold text-on-accent">
              {String(now.getHours()).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}
            </span>
            {/* тонкая линия через все дни */}
            <span className="absolute right-0 h-px -translate-y-1/2 bg-accent/60" style={{ left: LABEL_COL }} />
            {/* жирный отрезок + кружок в колонке сегодняшнего дня (та же сетка колонок) */}
            <div className="absolute inset-x-0 grid" style={columns}>
              <div className="relative" style={{ gridColumn: todayIndex + 2 }}>
                <span className="absolute inset-x-0 h-[3px] -translate-y-1/2 rounded-full bg-accent" />
                <span className="absolute -left-1.25 size-2.5 -translate-y-1/2 rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeGrid;
