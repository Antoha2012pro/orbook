import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { isSameDay, isWeekend, startOfDay } from "date-fns";
import { ChartNoAxesGantt, Eye, List } from "lucide-react";
import CurrentLessonCard from "../components/day/CurrentLessonCard";
import DayInfoBanner from "../components/day/DayInfoBanner";
import DayPageHeader from "../components/day/DayPageHeader";
import LessonList from "../components/day/LessonList";
import NextExamNote from "../components/day/NextExamNote";
import NotesSection from "../components/day/NotesSection";
import Timeline from "../components/day/Timeline";
import Segmented from "../components/ui/Segmented";
import { getDayInfo, getDayLessons, getHoliday, periods } from "../shared/data/timetable";
import { useNow } from "../shared/hooks/useNow";
import { useSheet } from "../shared/hooks/useSheet";
import { useUserStore } from "../shared/store/userStore";
import { parseISODate, toISODate } from "../shared/utils/dates";
import { applyHidden, getLiveStatus } from "../shared/utils/lessons";

// Варианты переключателя вида
const VIEWS = [
  { value: "liste", label: "Liste", icon: List },
  { value: "zeitleiste", label: "Zeitleiste", icon: ChartNoAxesGantt },
];

// ─────────────────────────────────────────────────────────────
// Страница дня.
//   /tag/2025-09-17 — любой день
//   /heute          — сегодня (datum в адресе нет)
//   ?ansicht=zeitleiste — вид «Zeitleiste» вместо «Liste»
// ─────────────────────────────────────────────────────────────
const Day = () => {
  const { datum } = useParams(); // дата из адреса (у /heute её нет)
  const now = useNow(); // текущее время
  const [searchParams, setSearchParams] = useSearchParams(); // ?ansicht=…
  const { openSheet } = useSheet(); // открыть шторку
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const showAllCourses = useUserStore((s) => s.showAllCourses); // вернуть все курсы

  const date = datum ? parseISODate(datum) : startOfDay(now); // какой день показываем
  if (!date) return <Navigate to="/heute" replace />; // кривая дата → сегодня

  const iso = toISODate(date); // "2025-09-17"
  const rawLessons = getDayLessons(date); // все уроки дня
  const lessons = applyHidden(rawLessons, hiddenCourses); // без скрытых курсов
  const hiddenHere = rawLessons.filter((l) => l && hiddenCourses.includes(l.course)).length; // сколько скрыто сегодня
  const hasLessons = lessons.some(Boolean); // есть ли что показать
  const info = getDayInfo(date); // «Info zum Tag»
  const holiday = getHoliday(date); // праздник?
  const live = isSameDay(date, now) ? getLiveStatus(lessons, now) : null; // что идёт сейчас (только сегодня)
  const showLive = live && ["running", "break", "before"].includes(live.kind); // показывать карточку «Jetzt»

  const view = searchParams.get("ansicht") === "zeitleiste" ? "zeitleiste" : "liste"; // текущий вид

  // Сменить вид (replace — не засоряем историю)
  const setView = (value) => {
    setSearchParams(
      (prev) => {
        if (value === "zeitleiste") prev.set("ansicht", value);
        else prev.delete("ansicht"); // «Liste» — вид по умолчанию, в адресе не нужен
        return prev;
      },
      { replace: true },
    );
  };

  // Открыть шторку урока по индексу
  const openLesson = (index) => openSheet("stunde", { datum: iso, stunde: periods[index].n });

  return (
    <section className="flex flex-col gap-3.5">
      <DayPageHeader date={date} now={now} search={view === "zeitleiste" ? "?ansicht=zeitleiste" : ""} />

      {hasLessons && <Segmented label="Ansicht" options={VIEWS} value={view} onChange={setView} />}

      {info && <DayInfoBanner info={info} onClick={() => openSheet("info", { datum: iso })} />}

      {/* нет уроков: праздник, выходной или всё скрыто */}
      {!hasLessons && (
        <div className="rounded-[22px] bg-card px-4 py-10 text-center">
          <p className="text-[17px] font-black text-ink">Kein Unterricht</p>
          <p className="mt-1 text-[13px] font-bold text-faint">
            {holiday ?? (isWeekend(date) ? "Wochenende" : "Alle Kurse ausgeblendet")}
          </p>
        </div>
      )}

      {/* вид «Liste» */}
      {hasLessons && view === "liste" && (
        <>
          {showLive && <CurrentLessonCard live={live} onOpen={openLesson} />}
          <LessonList date={date} lessons={lessons} now={now} onOpen={openLesson} />
        </>
      )}

      {/* вид «Zeitleiste» */}
      {hasLessons && view === "zeitleiste" && (
        <>
          <Timeline date={date} lessons={lessons} now={now} onOpen={openLesson} />
          <NextExamNote now={now} />
        </>
      )}

      {/* кнопка вернуть скрытые курсы */}
      {hiddenHere > 0 && (
        <button
          type="button"
          onClick={showAllCourses}
          className="flex items-center justify-center gap-2 text-[13px] font-extrabold text-accent"
        >
          <Eye className="size-4" /> {hiddenHere} {hiddenHere === 1 ? "Kurs" : "Kurse"} ausgeblendet · einblenden
        </button>
      )}

      <NotesSection date={date} />
    </section>
  );
};

export default Day;
