import { Info, NotebookPen } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { fachClasses, fachName } from "../../shared/utils/lessons";
import Badge from "../ui/Badge";
import StatusBadge from "../ui/StatusBadge";
import LessonContextMenu from "../lesson/LessonContextMenu";

// Новое значение + зачёркнутое старое («Kle ~~Mü~~»)
const WithOriginal = ({ value, original }) => (
  <>
    <span className={cn(original && "font-extrabold text-accent-ink")}>{value}</span>
    {original && <s className="ml-1 opacity-60">{original}</s>}
  </>
);

// ─────────────────────────────────────────────────────────────
// Один урок в списке «Liste» (скрин 1).
// live — { minutesLeft, progress }, если урок идёт прямо сейчас
// ─────────────────────────────────────────────────────────────
const LessonRow = ({ lesson, period, index, date, isPast, live, note, overrides, onOpen }) => {
  const isCancelled = lesson.status === "cancelled"; // fällt aus?

  return (
    // долгое нажатие / ПКМ → контекстное меню урока
    <LessonContextMenu lesson={lesson} date={date} index={index}>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full gap-3 text-left select-none [-webkit-touch-callout:none]"
      >
        {/* время слева */}
        <div className={cn("w-11 shrink-0 pt-3 text-right", isPast && "opacity-50")}>
          <p className="text-[14px] leading-4 font-black text-ink">{period.start}</p>
          <p className="text-[11px] font-bold text-faint">{period.end}</p>
        </div>

        {/* карточка урока */}
        <div
          className={cn(
            "relative min-w-0 flex-1 overflow-hidden rounded-2xl px-3.5 py-3",
            isCancelled ? "border-[1.5px] border-dashed border-faint2 text-faint" : fachClasses(lesson.fach, overrides),
            lesson.status === "changed" && "ring-2 ring-accent ring-inset", // рамка у замены
            live && "ring-2 ring-accent", // идущий урок тоже выделяем
            isPast && "opacity-50", // прошедшие — бледнее
          )}
        >
          {/* название + бейдж */}
          <div className="flex items-center justify-between gap-2">
            <span className={cn("truncate text-[15px] font-extrabold", isCancelled && "line-through")}>
              {fachName(lesson.fach)}
            </span>
            {live ? <Badge variant="live">Läuft · {live.minutesLeft} min</Badge> : <StatusBadge lesson={lesson} />}
          </div>

          {/* учитель · кабинет (при замене — старые значения зачёркнуты) */}
          <p className="mt-0.5 text-[12px] font-bold opacity-80">
            <WithOriginal value={lesson.teacher} original={lesson.originalTeacher} />
            {!isCancelled && (
              <>
                {" · Raum "}
                <WithOriginal value={lesson.room} original={lesson.originalRoom} />
              </>
            )}
          </p>

          {/* пояснение: домашка, причина отмены, тема Klausur */}
          {(lesson.info || lesson.topic) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold">
              <Info className="size-3.5 shrink-0" /> {lesson.topic ? `Klausur · ${lesson.topic}` : lesson.info}
            </p>
          )}

          {/* своя заметка к уроку */}
          {note && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold text-accent-ink">
              <NotebookPen className="size-3.5 shrink-0" /> <span className="truncate">{note.text}</span>
            </p>
          )}

          {/* полоска прогресса у идущего урока */}
          {live && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/20">
              <div className="h-full bg-accent" style={{ width: `${live.progress * 100}%` }} />
            </div>
          )}
        </div>
      </button>
    </LessonContextMenu>
  );
};

export default LessonRow;
