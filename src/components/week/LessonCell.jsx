import { Flag } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { fachClasses, fachName, statusBadge } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// Ячейка урока в сетке недели.
// Если урок есть — это кнопка (клик → шторка урока). Её оборачивает
// LessonContextMenu, поэтому все лишние пропсы (...props: style,
// onClick, onContextMenu, ref от Radix) передаём прямо на <button>.
// ─────────────────────────────────────────────────────────────
const LessonCell = ({ lesson, isPast, overrides, className, ...props }) => {
  // Общие классы ячейки
  const base = "relative flex flex-col justify-between gap-1.75 overflow-hidden rounded-[14px] px-2 py-1.75 leading-none";

  // Пустая ячейка (урока нет или курс скрыт)
  if (!lesson) {
    return <div style={props.style} className={cn(base, "bg-sand/60", className)} />;
  }

  // Классы для кнопки: текст слева, без выделения текста и системного меню iOS при долгом нажатии
  const interactive = "text-left select-none [-webkit-touch-callout:none] transition-transform active:scale-[0.97]";

  // Подпись для скринридера: «Mathe, Vertretung»
  const label = [fachName(lesson.fach), statusBadge(lesson)].filter(Boolean).join(", ");

  // Отменённый урок: пунктирная рамка, зачёркнутое сокращение
  if (lesson.status === "cancelled") {
    return (
      <button
        type="button"
        aria-label={label}
        {...props}
        className={cn(base, interactive, "border-[1.5px] border-dashed border-faint2 text-faint", isPast && "opacity-50", className)}
      >
        <span className="text-body-sm font-extrabold line-through">{lesson.short}</span>
      </button>
    );
  }

  const isChanged = lesson.status === "changed"; // Vertretung?

  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        base,
        interactive,
        fachClasses(lesson.fach, overrides), // цвет предмета (с учётом своего цвета)
        isChanged && "ring-2 ring-accent ring-inset", // рамка у замены
        isPast && "opacity-45", // прошедший урок бледнее
        className,
      )}
    >
      <span className="text-body-sm font-extrabold">{lesson.short}</span>
      <span
        className={cn(
          "text-small",
          lesson.exam || isChanged ? "font-extrabold text-accent-ink" : "font-bold opacity-70",
        )}
      >
        {lesson.exam ? "Test" : lesson.room}
      </span>

      {/* флажок Klausur в углу */}
      {lesson.exam && (
        <span className="absolute top-px right-px grid place-items-center rounded-tr-[14px] rounded-bl-md bg-accent p-1.25 text-on-accent">
          <Flag className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
};

export default LessonCell;
