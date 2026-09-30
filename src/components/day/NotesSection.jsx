import { Plus, RefreshCw } from "lucide-react";
import { getDayLessons, periods } from "../../shared/data/timetable";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";

// ─────────────────────────────────────────────────────────────
// «Meine Notizen» внизу страницы дня: заметки к урокам и на день.
// ─────────────────────────────────────────────────────────────
const NotesSection = ({ date }) => {
  const { openSheet } = useSheet(); // открыть шторку заметки
  const allNotes = useUserStore((s) => s.notes); // все заметки (выбираем целиком — фильтр ниже)
  const iso = toISODate(date); // "2025-09-17"
  const lessons = getDayLessons(date); // уроки дня (для подписи «2. Std · Mathe»)

  // Заметки этого дня: сначала к урокам по порядку, потом на день по времени
  const notes = allNotes
    .filter((n) => n.date === iso)
    .sort((a, b) => (a.period ?? 99) - (b.period ?? 99) || a.updatedAt - b.updatedAt);

  // Открыть заметку: к уроку — по номеру урока, на день — по id
  const open = (note) =>
    openSheet("notiz", note.period ? { datum: iso, stunde: note.period } : { datum: iso, id: note.id });

  return (
    <section className="flex flex-col gap-2.5">
      <header className="flex items-center justify-between px-1">
        <h2 className="text-[14px] font-extrabold text-muted">Meine Notizen</h2>
        {/* новая заметка на день */}
        <button
          type="button"
          onClick={() => openSheet("notiz", { datum: iso })}
          className="flex items-center gap-1 text-[14px] font-extrabold text-accent"
        >
          <Plus className="size-4" strokeWidth={3} /> Notiz
        </button>
      </header>

      {notes.length === 0 && (
        <p className="rounded-2xl bg-card px-4 py-3.5 text-[13px] font-bold text-faint">Noch keine Notizen für diesen Tag.</p>
      )}

      {notes.map((note) => {
        const lesson = note.period ? lessons[note.period - 1] : null; // урок заметки (если есть)
        return (
          <button
            key={note.id}
            type="button"
            onClick={() => open(note)}
            className="flex flex-col gap-1.5 rounded-2xl bg-card px-4 py-3.5 text-left"
          >
            {lesson && (
              <span className="text-[11px] font-extrabold text-accent-ink uppercase">
                {periods[note.period - 1].n}. Std · {fachName(lesson.fach)}
              </span>
            )}
            <span className="text-[15px] font-bold whitespace-pre-wrap text-ink">{note.text}</span>
            {/* статус синхронизации с «сервером» */}
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-faint">
              <RefreshCw className="size-3" />
              {note.synced ? "synchronisiert · nur für dich" : "wird gespeichert…"}
            </span>
          </button>
        );
      })}
    </section>
  );
};

export default NotesSection;
