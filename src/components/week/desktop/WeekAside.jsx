import { Link } from "react-router-dom";
import { startOfDay } from "date-fns";
import { getDayInfo, getDayLessons, getUpcomingExams, getWeekStats, periods } from "../../../shared/data/timetable";
import { useNow } from "../../../shared/hooks/useNow";
import { useSheet } from "../../../shared/hooks/useSheet";
import { useUserStore } from "../../../shared/store/userStore";
import { toISODate } from "../../../shared/utils/dates";
import { applyHidden, getLiveStatus } from "../../../shared/utils/lessons";
import CurrentLessonCard from "../../day/CurrentLessonCard";
import DayInfoBanner from "../../day/DayInfoBanner";
import ExamCard from "./ExamCard";
import WeekStatsCard from "./WeekStatsCard";

// ─────────────────────────────────────────────────────────────
// Правая колонка недели на ПК (макет «Seitenspalte», ширина 330px):
// «Jetzt» · Info zum Tag · Nächste Klausuren · статистика недели.
// На экранах 1024–1439px она стоит под сеткой (две колонки карточек).
// ─────────────────────────────────────────────────────────────
const WeekAside = ({ days }) => {
  const now = useNow(); // текущее время
  const { openSheet } = useSheet(); // открыть шторку
  const hiddenCourses = useUserStore((s) => s.hiddenCourses); // скрытые курсы
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета

  const today = startOfDay(now); // сегодня
  const todayLessons = applyHidden(getDayLessons(today), hiddenCourses); // уроки сегодня
  const live = getLiveStatus(todayLessons, now); // что идёт сейчас
  const showLive = live && ["running", "break", "before"].includes(live.kind); // показывать «Jetzt»
  const info = getDayInfo(today); // Info zum Tag (сегодня)
  const exams = getUpcomingExams(now).slice(0, 3); // 3 ближайшие Klausuren
  const stats = getWeekStats(days.slice(0, 5)); // статистика Mo–Fr показываемой недели

  // Открыть урок сегодняшнего дня
  const openToday = (index) => openSheet("stunde", { datum: toISODate(today), stunde: periods[index].n });

  return (
    <aside className="grid content-start gap-4 lg:grid-cols-2 desktop:grid-cols-1 print:hidden">
      {showLive && <CurrentLessonCard live={live} onOpen={openToday} />}
      {info && <DayInfoBanner info={info} onClick={() => openSheet("info", { datum: toISODate(today) })} />}

      {/* Nächste Klausuren */}
      {exams.length > 0 && (
        <section className="flex flex-col gap-2 lg:col-span-2 desktop:col-span-1">
          <header className="mt-1 flex items-center justify-between px-0.5">
            <h2 className="text-label font-extrabold text-muted">Nächste Klausuren</h2>
            <Link to="/testen" className="text-label font-extrabold text-accent">
              Alle
            </Link>
          </header>
          {exams.map((exam, i) => (
            <ExamCard key={`${toISODate(exam.date)}-${exam.period.n}`} exam={exam} now={now} overrides={overrides} highlight={i === 0} />
          ))}
        </section>
      )}

      <WeekStatsCard days={days.slice(0, 5)} stats={stats} />
    </aside>
  );
};

export default WeekAside;
