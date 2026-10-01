import { Info, NotebookPen } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { fachClasses, fachName } from "../../shared/utils/lessons";
import Badge from "../ui/Badge";
import StatusBadge from "../ui/StatusBadge";
import LessonContextMenu from "../lesson/LessonContextMenu";
import LessonTooltip from "../lesson/LessonTooltip";

// Новое значение + зачёркнутое старое («Kle ~~Mü~~»)
const WithOriginal = ({ value, original }) => (
  <>
    <span className={cn(original && "font-extrabold text-accent-ink")}>{value}</span>
    {original && <s className="ml-1 opacity-60">{original}</s>}
  </>
);

// ─────────────────────────────────────────────────────────────
// Один урок в списке «Liste».
//   variant="outside" — время слева снаружи карточки (телефон, скрин 1)
//   variant="inline"  — время внутри карточки (ПК, макет «Tag · Liste»)
// live — { minutesLeft, progress }, если урок идёт прямо сейчас
// ─────────────────────────────────────────────────────────────
const LessonRow = ({ lesson, period, index, date, isPast, live, note, overrides, onOpen, variant = "outside" }) => {
  const isCancelled = lesson.status === "cancelled"; // fällt aus?
  const inline = variant === "inline"; // вариант для ПК?

  // Время: «07:30 / 08:15»
  const time = (
    <div className={cn("shrink-0", inline ? "w-10" : "w-11 pt-3 text-right", !inline && isPast && "opacity-50")}>
      <p className={cn("text-body-sm leading-4 font-black", live && inline ? "text-accent-ink" : !inline && "text-ink")}>
        {period.start}
      </p>
      <p className={cn("text-small font-bold", inline ? "opacity-60" : "text-faint")}>{period.end}</p>
    </div>
  );

  // Содержимое карточки: название, бейдж, учитель · кабинет, пояснение, заметка
  const content = (
    <div className="min-w-0 flex-1">
      {/* название + бейдж */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn("truncate text-body font-extrabold", isCancelled && "line-through")}>{fachName(lesson.fach)}</span>
        {live ? <Badge variant="live">Läuft · {live.minutesLeft} min</Badge> : <StatusBadge lesson={lesson} />}
      </div>

      {/* учитель · кабинет (при замене — старые значения зачёркнуты) */}
      <p className="mt-0.5 text-caption font-bold opacity-80">
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
        <p className={cn("mt-1.5 flex items-center gap-1.5 text-caption font-bold", lesson.status === "changed" && "text-accent-ink")}>
          <Info className="size-3.5 shrink-0" /> {lesson.topic ? `Klausur · ${lesson.topic}` : lesson.info}
        </p>
      )}

      {/* своя заметка к уроку */}
      {note && (
        <p className="mt-1.5 flex items-center gap-1.5 text-caption font-bold text-accent-ink">
          <NotebookPen className="size-3.5 shrink-0" /> <span className="truncate">{note.text}</span>
        </p>
      )}
    </div>
  );

  // Классы цвета карточки
  const colors = isCancelled
    ? cn("border-[1.5px] border-dashed text-faint", inline ? "border-rule bg-sand/40" : "border-faint2")
    : fachClasses(lesson.fach, overrides);

  // Полоска прогресса у идущего урока
  const progress = live && (
    <div className={cn("absolute overflow-hidden", inline ? "inset-x-3.5 bottom-2 h-1 rounded-full bg-card/70" : "inset-x-0 bottom-0 h-1 bg-accent/20")}>
      <div className="h-full rounded-full bg-accent" style={{ width: `${live.progress * 100}%` }} />
    </div>
  );

  return (
    // долгое нажатие / ПКМ → контекстное меню; наведение мышью → подсказка
    <LessonContextMenu lesson={lesson} date={date} index={index}>
      <LessonTooltip lesson={lesson} period={period}>
        {inline ? (
          // ── ПК: время внутри карточки ──
          <button
            type="button"
            onClick={onOpen}
            className={cn(
              "relative flex w-full gap-4 overflow-hidden rounded-[18px] px-3.5 py-3 text-left transition-shadow outline-none select-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent/60",
              colors,
              live && "pb-4.5", // место под полоску прогресса
              isPast && "opacity-50",
            )}
          >
            {time}
            {content}
            {progress}
          </button>
        ) : (
          // ── телефон: время снаружи слева ──
          <button type="button" onClick={onOpen} className="flex w-full gap-3 rounded-2xl text-left outline-none select-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-accent/60">
            {time}
            <div
              className={cn(
                "relative flex min-w-0 flex-1 overflow-hidden rounded-2xl px-3.5 py-3",
                colors,
                lesson.status === "changed" && "ring-2 ring-accent ring-inset", // рамка у замены
                live && "ring-2 ring-accent", // идущий урок тоже выделяем
                isPast && "opacity-50", // прошедшие — бледнее
              )}
            >
              {content}
              {progress}
            </div>
          </button>
        )}
      </LessonTooltip>
    </LessonContextMenu>
  );
};

export default LessonRow;
