import { Flag } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { fachColors } from "../../shared/constants/fachColors";

const LessonCell = ({ lesson, isPast, style }) => {
  const base = "relative flex gap-1.75 flex-col justify-between rounded-[14px] px-2 py-1.75 leading-[0,7] overflow-hidden";

  if (!lesson) {
    return <div style={style} className={cn(base, "bg-sand/60")} />;
  }

  if (lesson.status === "cancelled") {
    return (
      <div
        style={style}
        className={cn(base, "border-[1.5px] border-dashed border-faint2 text-faint", isPast && "opacity-50")}
      >
        <span className="text-[14px] font-extrabold line-through">{lesson.short}</span>
      </div>
    );
  }

  const isChanged = lesson.status === "changed";

  return (
    <div
      style={style}
      className={cn(
        base,
        fachColors[lesson.fach],
        isChanged && "ring-2 ring-accent ring-inset",
        isPast && "opacity-45",
      )}
    >
      <span className="text-[14px] font-extrabold">{lesson.short}</span>
      <span
        className={cn(
          "text-[11px]",
          lesson.exam || isChanged ? "font-extrabold text-accent-ink" : "font-bold opacity-70",
        )}
      >
        {lesson.exam ? "Test" : lesson.room}
      </span>

      {lesson.exam && (
        <span className="absolute top-px right-px grid p-1.25 place-items-center rounded-bl-md rounded-tr-[14px] bg-accent text-on-accent">
          <Flag className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </div>
  );
};

export default LessonCell;