import { fachName } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// Фиолетовая карточка «Jetzt · Physik · 301 · noch 27 min».
// live — результат getLiveStatus(): идёт урок, перемена или уроки ещё не начались.
// onOpen(index) — открыть шторку урока
// ─────────────────────────────────────────────────────────────
const CurrentLessonCard = ({ live, onOpen }) => {
  const isRunning = live.kind === "running"; // идёт урок?
  const item = isRunning ? live.current : live.next; // о каком уроке карточка
  const { lesson, period } = item;

  // Нижняя строка
  let footer;
  if (isRunning && live.next) {
    // «Danach 20 min Pause · 11:35 Geschichte, Raum 108»
    const nextText = `${live.next.period.start} ${fachName(live.next.lesson.fach)}, Raum ${live.next.lesson.room}`;
    footer = live.breakAfter > 0 ? `Danach ${live.breakAfter} min Pause · ${nextText}` : `Danach ${nextText}`;
  } else if (isRunning) {
    footer = "Danach ist Schulschluss"; // это последний урок
  } else {
    footer = `Beginn ${period.start} · bis ${period.end}`; // перемена / утро
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(item.index)}
      className="flex flex-col gap-2.5 rounded-[22px] bg-accent p-4 text-left text-on-accent"
    >
      {/* верхняя строка */}
      <div className="flex items-baseline gap-2">
        <span className="text-caption font-extrabold opacity-75">{isRunning ? "Jetzt" : "Gleich"}</span>
        <span className="min-w-0 flex-1 truncate text-subhead font-black">
          {fachName(lesson.fach)} · {lesson.room}
        </span>
        <span className="shrink-0 text-label font-extrabold opacity-90">
          {isRunning ? `noch ${live.minutesLeft} min` : `in ${live.minutesLeft} min`}
        </span>
      </div>

      {/* полоска прогресса урока (только когда урок идёт) */}
      {isRunning && (
        <div className="h-1.5 overflow-hidden rounded-full bg-on-accent/25">
          <div className="h-full rounded-full bg-on-accent" style={{ width: `${live.progress * 100}%` }} />
        </div>
      )}

      <p className="text-caption font-bold opacity-80">{footer}</p>
    </button>
  );
};

export default CurrentLessonCard;
