import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { addDays, addWeeks, differenceInCalendarISOWeeks, getISOWeek, isSameDay, isSameISOWeek, startOfISOWeek } from "date-fns";
import { ArrowLeft, ArrowRight, ChartNoAxesColumn, ChevronRight, Flag } from "lucide-react";
import WeekGrid from "../components/week/WeekGrid";
import WeekMenu from "../components/week/WeekMenu";
import DayPanel from "../components/week/desktop/DayPanel";
import PeriodGrid from "../components/week/desktop/PeriodGrid";
import TimeGrid from "../components/week/desktop/TimeGrid";
import WeekAside from "../components/week/desktop/WeekAside";
import WeekHeaderDesktop from "../components/week/desktop/WeekHeaderDesktop";
import { useHotkeys } from "../shared/hooks/useHotkeys";
import { DESKTOP_QUERY, useMediaQuery } from "../shared/hooks/useMediaQuery";
import { usePlanStore } from "../shared/store/planStore";
import { cn } from "../shared/utils/cn";
import { getNextExam, getWeekStats, periods } from "../shared/data/timetable";
import { useNow } from "../shared/hooks/useNow";
import { useSheet } from "../shared/hooks/useSheet";
import { useUserStore } from "../shared/store/userStore";
import { formatDe, parseISODate, relativeDays, toISODate } from "../shared/utils/dates";
import { fachName } from "../shared/utils/lessons";

// Заголовок недели: «Diese Woche», «Nächste Woche», «Letzte Woche» или месяц
const weekTitle = (weekStart, now) => {
  const diff = differenceInCalendarISOWeeks(weekStart, now); // на сколько недель от текущей
  if (diff === 0) return "Diese Woche";
  if (diff === 1) return "Nächste Woche";
  if (diff === -1) return "Letzte Woche";
  return formatDe(weekStart, "MMMM"); // например, «Oktober»
};

// Круглая кнопка в шапке
const roundButton = "flex size-9.5 items-center justify-center rounded-full bg-card outline-none focus-visible:ring-2 focus-visible:ring-accent/50"; // фиолетовая обводка при фокусе с клавиатуры

const Week = () => {
  const now = useNow(); // текущее время
  const { openSheet } = useSheet(); // открыть шторку
  const [searchParams, setSearchParams] = useSearchParams(); // параметры адреса
  const showWeekend = useUserStore((s) => s.showWeekend); // показывать ли выходные

  // Показываемая неделя живёт в адресе: /woche?woche=2025-09-15
  // (поэтому «Назад» со страницы дня возвращает на ту же неделю)
  const weekStart = startOfISOWeek(parseISODate(searchParams.get("woche")) ?? now);
  const lastDay = addDays(weekStart, showWeekend ? 6 : 4); // последний показанный день
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Mo–Fr для статистики

  // Сменить неделю (replace — стрелки не засоряют историю браузера)
  const setWeek = (date) => {
    setSearchParams(
      (prev) => {
        prev.set("woche", toISODate(startOfISOWeek(date)));
        return prev;
      },
      { replace: true },
    );
  };

  const stats = getWeekStats(days); // отмены и замены за неделю
  const nextExam = getNextExam(now); // ближайшая Klausur

  // ── ПК ──
  const navigate = useNavigate(); // переход на другую страницу
  const isDesktop = useMediaQuery(DESKTOP_QUERY); // ≥ 1024px — компьютерный вид
  const reloadPlan = usePlanStore((s) => s.reload); // «Plan neu laden»
  const dayCount = showWeekend ? 7 : 5; // сколько дней показывать
  const allDays = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i)); // показанные дни
  const view = searchParams.get("ansicht") === "stunden" ? "stunden" : "zeitraster"; // вид недели на ПК

  // Выбранный день для «Stunden + Tag»: из адреса (?tag=…), иначе сегодня (если эта неделя), иначе понедельник
  const tagParam = parseISODate(searchParams.get("tag"));
  const selectedDay =
    tagParam && isSameISOWeek(tagParam, weekStart)
      ? tagParam
      : allDays.find((d) => isSameDay(d, now)) ?? weekStart;

  // Поменять параметр адреса (null — удалить); replace — без новой записи в истории
  const setParam = (key, value) => {
    setSearchParams(
      (prev) => {
        if (value == null) prev.delete(key);
        else prev.set(key, value);
        return prev;
      },
      { replace: true },
    );
  };

  // Горячие клавиши недели: ← → неделя, T сегодня, D Tagesansicht, R Plan neu laden
  useHotkeys({
    arrowleft: () => setWeek(addWeeks(weekStart, -1)),
    arrowright: () => setWeek(addWeeks(weekStart, 1)),
    t: () => setWeek(now),
    d: () => navigate("/heute"),
    r: reloadPlan,
  });

  if (isDesktop) {
    return (
      <section className="flex flex-col gap-6">
        <WeekHeaderDesktop
          weekStart={weekStart}
          subtitle={`KW ${getISOWeek(weekStart)} · ${formatDe(weekStart, "d.")}–${formatDe(lastDay, "d. MMMM")}`}
          title={weekTitle(weekStart, now)}
          view={view}
          onViewChange={(value) => setParam("ansicht", value === "stunden" ? "stunden" : null)}
          onWeekChange={setWeek}
          onToday={() => setWeek(now)}
        />

        {/* сетка + правая часть; на экране ≥ 1440px — рядом, на 1024–1439px — правая часть под сеткой */}
        <div
          className={cn(
            "grid items-start gap-8",
            view === "stunden" ? "desktop:grid-cols-[minmax(0,1fr)_420px]" : "desktop:grid-cols-[minmax(0,1fr)_330px]",
          )}
        >
          {view === "stunden" ? (
            <>
              <PeriodGrid
                weekStart={weekStart}
                dayCount={dayCount}
                selectedDay={selectedDay}
                onSelectDay={(day) => setParam("tag", toISODate(day))}
                onLessonClick={(day, index) => openSheet("stunde", { datum: toISODate(day), stunde: periods[index].n })}
              />
              <DayPanel day={selectedDay} />
            </>
          ) : (
            <>
              <TimeGrid
                weekStart={weekStart}
                dayCount={dayCount}
                onLessonClick={(day, index) => openSheet("stunde", { datum: toISODate(day), stunde: periods[index].n })}
              />
              <WeekAside days={allDays} />
            </>
          )}
        </div>
      </section>
    );
  }

  // ── Телефон ──

  return (
    <section className="flex flex-col gap-3.5">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {/* «KW 38 · 15.–19. Sept.» — по нажатию открывается календарь «Woche wählen» */}
          <button
            type="button"
            onClick={() => openSheet("kalender", { kw: toISODate(weekStart) })}
            className="block text-label leading-[0.8] font-extrabold text-faint"
          >
            KW {getISOWeek(weekStart)} · {formatDe(weekStart, "d.")}–{formatDe(lastDay, "d. MMM")}
          </button>
          <h2 className="truncate text-title leading-[1.1] font-black text-ink">{weekTitle(weekStart, now)}</h2>
        </div>
        {/* как на макете: ‹ ⋮ › (календарь — в меню «⋮» и по нажатию на строку KW) */}
        <div className="flex shrink-0 gap-1.5">
          <button type="button" aria-label="Vorherige Woche" onClick={() => setWeek(addWeeks(weekStart, -1))} className={roundButton}>
            <ArrowLeft className="size-4.25" />
          </button>
          <WeekMenu
            weekStart={weekStart}
            onToday={() => setWeek(now)}
            onPickWeek={() => openSheet("kalender", { kw: toISODate(weekStart) })}
          />
          <button type="button" aria-label="Nächste Woche" onClick={() => setWeek(addWeeks(weekStart, 1))} className={roundButton}>
            <ArrowRight className="size-4.25" />
          </button>
        </div>
      </header>

      {/* клик по уроку → шторка урока; клик по дню — ссылка внутри сетки */}
      <WeekGrid
        weekStart={weekStart}
        onLessonClick={(day, index) => openSheet("stunde", { datum: toISODate(day), stunde: periods[index].n })}
      />

      <div className="flex flex-col divide-y divide-hair rounded-[22px] bg-card px-3.5 text-faint">
        {/* ближайшая Klausur → страница этого дня */}
        {nextExam && (
          <Link to={`/tag/${toISODate(nextExam.date)}`} className="flex items-center gap-3 py-2">
            <Flag className="size-4.75 shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-body leading-5 font-medium text-ink">
                {formatDe(nextExam.date, "EEEEEE")} · {fachName(nextExam.lesson.fach)}
              </h3>
              <p className="mt-0.5 truncate text-caption leading-4">
                Nächste Klausur{nextExam.lesson.topic && ` · ${nextExam.lesson.topic}`}
              </p>
            </div>
            <span className="shrink-0 text-label whitespace-nowrap">{relativeDays(nextExam.date, now)}</span>
            <ChevronRight className="size-4 shrink-0" />
          </Link>
        )}

        {/* статистика недели */}
        <div className="flex items-center gap-3 py-4">
          <ChartNoAxesColumn className="size-4.75 shrink-0" />
          <h3 className="min-w-0 flex-1 text-body leading-5 font-medium text-ink">
            {stats.cancelled} {stats.cancelled === 1 ? "fällt" : "fallen"} aus · {stats.changed}{" "}
            {stats.changed === 1 ? "Vertretung" : "Vertretungen"}
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Week;
