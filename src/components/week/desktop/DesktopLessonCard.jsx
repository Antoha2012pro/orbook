import { cn } from "../../../shared/utils/cn";
import { fachClasses, fachName, statusBadge } from "../../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// Карточка урока в сетке недели на ПК (макет: 128×77, скругление 14px).
//   обычный   — цвет предмета, «Web · 102»
//   замена    — светло-фиолетовый фон + фиолетовая рамка, «VERTRETUNG»
//   отменён   — пунктир, серый текст, бейдж «FÄLLT AUS»
//   Klausur   — фиолетовая рамка + бейдж «KLAUSUR» / «TEST»
//   прошёл    — бледнее
// ...props (style, onClick, ref и обработчики меню/подсказки) идут прямо на <button>
// ─────────────────────────────────────────────────────────────
const DesktopLessonCard = ({ lesson, isPast, overrides, className, ...props }) => {
  const isCancelled = lesson.status === "cancelled"; // fällt aus?
  const isChanged = lesson.status === "changed"; // Vertretung?

  return (
    <button
      type="button"
      aria-label={[fachName(lesson.fach), statusBadge(lesson)].filter(Boolean).join(", ")}
      {...props}
      className={cn(
        "flex flex-col items-start overflow-hidden rounded-[14px] px-2.75 py-2.25 text-left select-none",
        "transition-[transform,box-shadow] outline-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent/60 active:scale-[0.98]",
        isCancelled
          ? "border-[1.5px] border-dashed border-faint2 text-faint" // отменён: пунктир
          : fachClasses(lesson.fach, overrides), // цвет предмета
        isChanged && "bg-tint ring-2 ring-accent ring-inset", // замена: фиолетовый фон и рамка
        lesson.exam && "ring-2 ring-accent ring-inset", // Klausur: фиолетовая рамка
        isPast && "opacity-45", // прошедший урок
        className,
      )}
    >
      {/* название предмета */}
      <span className={cn("w-full truncate text-body leading-tight font-extrabold", isCancelled && "line-through")}>
        {fachName(lesson.fach)}
      </span>

      {/* учитель · кабинет (при замене — фиолетовым) */}
      <span className={cn("mt-0.5 w-full truncate text-caption", isChanged ? "font-extrabold text-accent-ink" : "font-semibold opacity-75")}>
        {lesson.teacher} · {lesson.room}
      </span>

      {/* бейджи */}
      {isCancelled && (
        <span className="mt-1.5 rounded-full border border-faint2 px-2 py-0.5 text-micro font-extrabold tracking-wide uppercase">
          fällt aus
        </span>
      )}
      {isChanged && <span className="mt-1.5 px-2 text-micro font-extrabold tracking-wide text-accent-ink uppercase">Vertretung</span>}
      {lesson.exam && (
        <span className="mt-1.5 rounded-full bg-accent px-2 py-0.5 text-micro font-extrabold tracking-wide text-on-accent uppercase">
          {lesson.examType === "test" ? "Test" : "Klausur"}
        </span>
      )}
    </button>
  );
};

export default DesktopLessonCard;
