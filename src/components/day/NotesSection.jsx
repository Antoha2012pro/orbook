import { Plus, RefreshCw } from "lucide-react";
import { getDayLessons, periods } from "../../shared/data/timetable";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// «Meine Notizen»: заметки к урокам и на день.
//   variant="list" — телефон: заголовок + отдельные карточки
//   variant="card" — ПК: всё в одной белой карточке (макет «Tag · Liste», правая колонка)
// ─────────────────────────────────────────────────────────────
const NotesSection = ({ date, variant = "list" }) => {
  const { openSheet } = useSheet(); // открыть шторку заметки
  const allNotes = useUserStore((s) => s.notes); // все заметки (выбираем целиком — фильтр ниже)
  const iso = toISODate(date); // "2025-09-17"
  const lessons = getDayLessons(date); // уроки дня (для подписи «Sport · 6. Std»)
  const isCard = variant === "card"; // вариант для ПК?

  // Заметки этого дня: сначала к урокам по порядку, потом на день по времени
  const notes = allNotes
    .filter((n) => n.date === iso)
    .sort((a, b) => (a.period ?? 99) - (b.period ?? 99) || a.updatedAt - b.updatedAt);

  // Открыть заметку: к уроку — по номеру урока, на день — по id
  const open = (note) => openSheet("notiz", note.period ? { datum: iso, stunde: note.period } : { datum: iso, id: note.id });

  // Подпись под заметкой: «↻ Sport · 6. Std · nur für dich»
  const meta = (note) => {
    const lesson = note.period ? lessons[note.period - 1] : null; // урок заметки (если есть)
    const where = lesson ? `${fachName(lesson.fach)} · ${periods[note.period - 1].n}. Std · ` : "";
    return note.synced ? `${where}nur für dich` : "wird gespeichert…";
  };

  return (
    <section className={cn("flex flex-col", isCard ? "rounded-[24px] bg-card p-4" : "gap-2.5")}>
      <header className={cn("flex items-center justify-between", !isCard && "px-1")}>
        <h2 className={cn("font-extrabold", isCard ? "text-label text-faint" : "text-body-sm text-muted")}>Meine Notizen</h2>
        {/* новая заметка на день */}
        <button
          type="button"
          onClick={() => openSheet("notiz", { datum: iso })}
          className={cn("flex items-center gap-1 font-extrabold text-accent", isCard ? "text-label" : "text-body-sm")}
        >
          <Plus className="size-4" strokeWidth={3} /> Notiz
        </button>
      </header>

      {notes.length === 0 && (
        <p className={cn("text-label font-bold text-faint", isCard ? "mt-2.5" : "rounded-2xl bg-card px-4 py-3.5")}>
          Noch keine Notizen für diesen Tag.
        </p>
      )}

      {/* на ПК заметки идут списком с линиями-разделителями внутри карточки */}
      <div className={cn("flex flex-col", isCard ? "mt-1 divide-y divide-hair" : "gap-2.5")}>
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => open(note)}
            className={cn("flex flex-col gap-1 text-left", isCard ? "py-3" : "rounded-2xl bg-card px-4 py-3.5")}
          >
            <span className="text-body font-medium whitespace-pre-wrap text-ink">{note.text}</span>
            {/* статус синхронизации с «сервером» */}
            <span className="flex items-center gap-1.5 text-caption font-semibold text-faint">
              <RefreshCw className="size-3" /> {meta(note)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default NotesSection;
