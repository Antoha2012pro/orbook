import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { isSameDay, isWeekend, startOfDay } from "date-fns";
import { ChartNoAxesGantt, Eye, List } from "lucide-react";
import CurrentLessonCard from "../components/day/CurrentLessonCard";
import DayInfoBanner from "../components/day/DayInfoBanner";
import DayPageHeader from "../components/day/DayPageHeader";
import LessonList from "../components/day/LessonList";
import NextExamNote from "../components/day/NextExamNote";
import NotesSection from "../components/day/NotesSection";
import Timeline from "../components/day/Timeline";
import DayHeaderDesktop from "../components/day/desktop/DayHeaderDesktop";
import DayInfoCard from "../components/day/desktop/DayInfoCard";
import DayStrip from "../components/day/desktop/DayStrip";
import UpcomingCard from "../components/day/desktop/UpcomingCard";
import { useHotkeys } from "../shared/hooks/useHotkeys";
import { DESKTOP_QUERY, useMediaQuery } from "../shared/hooks/useMediaQuery";
import Segmented from "../components/ui/Segmented";
import { getDayInfo, getDayLessons, getHoliday, periods } from "../shared/data/timetable";
import { useNow } from "../shared/hooks/useNow";
import { useSheet } from "../shared/hooks/useSheet";
import { useUserStore } from "../shared/store/userStore";
import { parseISODate, shiftSchoolDay, toISODate } from "../shared/utils/dates";
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
  const navigate = useNavigate(); // переход на другой день
  const isDesktop = useMediaQuery(DESKTOP_QUERY); // ≥ 1024px — компьютерный вид

  const date = datum ? parseISODate(datum) : startOfDay(now); // какой день показываем
  const view = searchParams.get("ansicht") === "zeitleiste" ? "zeitleiste" : "liste"; // текущий вид
  const search = view === "zeitleiste" ? "?ansicht=zeitleiste" : ""; // хвост адреса для ссылок на другие дни

  // Горячие клавиши дня: ← → день, T сегодня, L / Z вид.
  // (вызываем до return ниже — хуки должны вызываться всегда)
  useHotkeys(
    {
      arrowleft: () => navigate(`/tag/${toISODate(shiftSchoolDay(date, -1))}${search}`),
      arrowright: () => navigate(`/tag/${toISODate(shiftSchoolDay(date, 1))}${search}`),
      t: () => navigate(`/heute${search}`),
      l: () => setView("liste"),
      z: () => setView("zeitleiste"),
    },
    Boolean(date), // для кривой даты клавиши не нужны
  );

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

  // Блок «нет уроков»: праздник, выходной или всё скрыто
  const emptyDay = !hasLessons && (
    <div className="rounded-[22px] bg-card px-4 py-10 text-center">
      <p className="text-subhead text-ink">Kein Unterricht</p>
      <p className="mt-1 text-label font-bold text-faint">{holiday ?? (isWeekend(date) ? "Wochenende" : "Alle Kurse ausgeblendet")}</p>
    </div>
  );

  // Кнопка «вернуть скрытые курсы»
  const restoreHidden = hiddenHere > 0 && (
    <button type="button" onClick={showAllCourses} className="flex items-center justify-center gap-2 text-label font-extrabold text-accent">
      <Eye className="size-4" /> {hiddenHere} {hiddenHere === 1 ? "Kurs" : "Kurse"} ausgeblendet · einblenden
    </button>
  );

  // ── ПК (макет «Tag · Liste» / «Tag · Zeitleiste») ──
  if (isDesktop) {
    return (
      <section className="flex flex-col gap-5">
        <DayHeaderDesktop
          date={date}
          now={now}
          view={view}
          onViewChange={setView}
          search={search}
          onShare={() => openSheet("teilen", { bereich: "heute" })}
        />
        <DayStrip date={date} now={now} search={search} />

        {/* левая колонка — уроки, правая (360px) — Info, заметки, «Kommt noch».
            На 1024–1439px правая колонка уходит вниз */}
        <div className="grid items-start gap-9 desktop:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-3.5">
            {showLive && <CurrentLessonCard live={live} onOpen={openLesson} />}
            {emptyDay}
            {hasLessons && view === "liste" && <LessonList date={date} lessons={lessons} now={now} onOpen={openLesson} variant="inline" />}
            {hasLessons && view === "zeitleiste" && <Timeline date={date} lessons={lessons} now={now} onOpen={openLesson} />}
            {restoreHidden}
          </div>

          <aside className="grid content-start gap-4 lg:grid-cols-2 desktop:grid-cols-1">
            {info && <DayInfoCard info={info} onOpen={() => openSheet("info", { datum: iso })} />}
            <NotesSection date={date} variant="card" />
            <div className="lg:col-span-2 desktop:col-span-1">
              <UpcomingCard now={now} />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // ── Телефон ──

  return (
    <section className="flex flex-col gap-3.5">
      <DayPageHeader date={date} now={now} search={search} />

      {hasLessons && <Segmented label="Ansicht" options={VIEWS} value={view} onChange={setView} />}

      {info && <DayInfoBanner info={info} onClick={() => openSheet("info", { datum: iso })} />}

      {/* нет уроков: праздник, выходной или всё скрыто */}
      {emptyDay}

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
      {restoreHidden}

      <NotesSection date={date} />
    </section>
  );
};

export default Day;
