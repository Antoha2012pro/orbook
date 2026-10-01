import * as Tooltip from "@radix-ui/react-tooltip";
import { fachName, statusBadge } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// Подсказка при наведении мышью на урок (только ПК — на телефоне
// Radix Tooltip сам не открывается от касания).
// ...props передаём в Tooltip.Trigger: так компонент можно класть
// внутрь LessonContextMenu (тот передаёт свои обработчики дальше).
// ─────────────────────────────────────────────────────────────
const LessonTooltip = ({ lesson, period, children, ...props }) => {
  const status = statusBadge(lesson); // «Vertretung» / «fällt aus» / «Klausur» / null

  // Строка про учителя и кабинет: при замене — «Kle statt Mü · Raum 204 statt 108»
  const teacher = lesson.originalTeacher ? `${lesson.teacher} statt ${lesson.originalTeacher}` : lesson.teacher;
  const room = lesson.originalRoom ? `Raum ${lesson.room} statt ${lesson.originalRoom}` : `Raum ${lesson.room}`;

  return (
    <Tooltip.Root>
      {/* onFocus + preventDefault: подсказка только от мыши, а не когда фокус
          возвращается на урок после закрытия панели (иначе висела бы поверх) */}
      <Tooltip.Trigger asChild {...props} onFocus={(event) => event.preventDefault()}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-50 max-w-64 rounded-xl bg-ink px-3 py-2 text-caption font-semibold text-paper shadow-lg data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in"
        >
          <p className="text-body-sm font-extrabold">
            {fachName(lesson.fach)} · {period.n}. Std
          </p>
          <p className="opacity-80">
            {period.start}–{period.end} · {teacher} · {room}
          </p>
          {status && <p className="mt-0.5 font-extrabold text-today-sub">{status}{lesson.topic ? ` · ${lesson.topic}` : ""}</p>}
          {lesson.info && <p className="opacity-80">{lesson.info}</p>}
          <Tooltip.Arrow className="fill-ink" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

export default LessonTooltip;
