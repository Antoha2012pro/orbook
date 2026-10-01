import { useState } from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesGantt, List } from "lucide-react";
import { getDayInfo, getDayLessons, periods } from "../../../shared/data/timetable";
import { useNow } from "../../../shared/hooks/useNow";
import { useSheet } from "../../../shared/hooks/useSheet";
import { useUserStore } from "../../../shared/store/userStore";
import { formatDe, relativeDayWord, toISODate } from "../../../shared/utils/dates";
import { applyHidden } from "../../../shared/utils/lessons";
import DayInfoBanner from "../../day/DayInfoBanner";
import LessonList from "../../day/LessonList";
import Timeline from "../../day/Timeline";
import Segmented from "../../ui/Segmented";

// Переключатель «Liste / Zeitleiste» (только иконки, как на макете)
const VIEWS = [
  { value: "liste", label: "Liste", icon: List },
  { value: "zeitleiste", label: "Zeitleiste", icon: ChartNoAxesGantt },
];

// ─────────────────────────────────────────────────────────────
// Правая карточка вида «Stunden + Tag»: уроки выбранного дня.
// Заголовок — ссылка на полную страницу дня.
// ─────────────────────────────────────────────────────────────
const DayPanel = ({ day }) => {
  const now = useNow(); // текущее время
  const { openSheet } = useSheet(); // открыть шторку
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const [view, setView] = useState("liste"); // вид внутри карточки

  const iso = toISODate(day); // "2025-09-17"
  const lessons = applyHidden(getDayLessons(day), hiddenCourses); // уроки дня
  const hasLessons = lessons.some(Boolean); // есть ли уроки
  const info = getDayInfo(day); // Info zum Tag
  const word = relativeDayWord(day, now); // heute / morgen / gestern

  // Открыть урок
  const openLesson = (index) => openSheet("stunde", { datum: iso, stunde: periods[index].n });

  return (
    <section className="flex flex-col gap-3.5 rounded-[24px] bg-card p-4.5">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label font-extrabold text-accent">
            {formatDe(day, "EEEE")}
            {word && ` · ${word}`}
          </p>
          {/* ссылка на страницу дня */}
          <Link to={`/tag/${iso}`} className="block truncate text-[28px] leading-tight font-black text-ink hover:underline">
            {formatDe(day, "d. MMMM")}
          </Link>
        </div>
        {hasLessons && (
          <Segmented label="Ansicht" options={VIEWS} value={view} onChange={setView} variant="accent" size="sm" iconOnly className="shrink-0" />
        )}
      </header>

      {info && <DayInfoBanner info={info} onClick={() => openSheet("info", { datum: iso })} />}

      {!hasLessons && <p className="py-10 text-center text-body font-bold text-faint">Kein Unterricht</p>}
      {hasLessons && view === "liste" && <LessonList date={day} lessons={lessons} now={now} onOpen={openLesson} variant="inline" />}
      {hasLessons && view === "zeitleiste" && <Timeline date={day} lessons={lessons} now={now} onOpen={openLesson} />}

    </section>
  );
};

export default DayPanel;
