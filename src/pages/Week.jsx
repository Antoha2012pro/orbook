import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  format,
  getISOWeek,
  isValid,
  parseISO,
  startOfISOWeek,
} from "date-fns";
import { de } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Calendar, ChartNoAxesColumn, ChevronRight, Flag } from "lucide-react";
import WeekGrid from "../components/week/WeekGrid";
import DayModal from "../components/week/DayModal";
import { getNextExam, getWeekStats } from "../shared/data/timetable";
import { fachNames } from "../shared/constants/fachColors";
import { useNow } from "../shared/hooks/useNow";

// "in 2 Tagen" / "morgen" / "heute"
const relativeDays = (date, now) => {
  const diff = differenceInCalendarDays(date, now);
  if (diff === 0) return "heute";
  if (diff === 1) return "morgen";
  return `in ${diff} Tagen`;
};

const Week = () => {
  const now = useNow();
  const [searchParams, setSearchParams] = useSearchParams();

  // Открытый день берём из URL: /woche?tag=2025-09-17
  const tagParam = searchParams.get("tag");
  const parsed = tagParam ? parseISO(tagParam) : null;
  const selectedDay = parsed && isValid(parsed) ? parsed : null;

  // Показываемая неделя (по ссылке с ?tag= — неделя этого дня)
  const [weekStart, setWeekStart] = useState(() => startOfISOWeek(selectedDay ?? new Date()));
  const friday = addDays(weekStart, 4);
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const stats = getWeekStats(days);
  const nextExam = getNextExam(now);

  const openDay = (day) => {
    setSearchParams((prev) => {
      prev.set("tag", format(day, "yyyy-MM-dd"));
      return prev;
    });
  };

  const closeDay = () => {
    if (!searchParams.has("tag")) return;
    setSearchParams(
      (prev) => {
        prev.delete("tag");
        return prev;
      },
      { replace: true },
    );
  };

  return (
    <section className="flex flex-col gap-3.5">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[13px] leading-[0.8] font-extrabold text-faint">
            KW {getISOWeek(weekStart)} · {format(weekStart, "d.")}–{format(friday, "d. MMM", { locale: de })}
          </p>
          <h2 className="text-[29px] leading-[1.1] font-black text-ink">Diese Woche</h2>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Vorherige Woche"
            onClick={() => setWeekStart((w) => addWeeks(w, -1))}
            className="flex size-9.5 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="size-4.25" />
          </button>
          <button
            type="button"
            aria-label="Aktuelle Woche"
            onClick={() => setWeekStart(startOfISOWeek(new Date()))}
            className="flex size-9.5 items-center justify-center rounded-full bg-card"
          >
            <Calendar className="size-4.25" />
          </button>
          <button
            type="button"
            aria-label="Nächste Woche"
            onClick={() => setWeekStart((w) => addWeeks(w, 1))}
            className="flex size-9.5 items-center justify-center rounded-full bg-card"
          >
            <ArrowRight className="size-4.25" />
          </button>
        </div>
      </header>

      <WeekGrid weekStart={weekStart} onDayClick={openDay} />

      <div className="flex flex-col divide-y divide-hair rounded-[22px] bg-card px-3.5 text-faint">
        {nextExam && (
          <button
            type="button"
            onClick={() => openDay(nextExam.date)}
            className="flex items-center gap-3 py-2 text-left"
          >
            <Flag className="size-4.75 shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] leading-5 font-medium text-ink">
                {format(nextExam.date, "EEEEEE", { locale: de })} · {fachNames[nextExam.lesson.fach]}
              </h3>
              <p className="mt-0.5 truncate text-[12px] leading-4">
                Nächste Klausur{nextExam.lesson.topic && ` · ${nextExam.lesson.topic}`}
              </p>
            </div>
            <span className="shrink-0 text-[13px] whitespace-nowrap">{relativeDays(nextExam.date, now)}</span>
            <ChevronRight className="size-4 shrink-0" />
          </button>
        )}

        <div className="flex items-center gap-3 py-4">
          <ChartNoAxesColumn className="size-4.75 shrink-0" />
          <h3 className="min-w-0 flex-1 text-[15px] leading-5 font-medium text-ink">
            {stats.cancelled} {stats.cancelled === 1 ? "fällt" : "fallen"} aus · {stats.changed}{" "}
            {stats.changed === 1 ? "Vertretung" : "Vertretungen"}
          </h3>
        </div>
      </div>

      <DayModal day={selectedDay} onClose={closeDay} />
    </section>
  );
};

export default Week;