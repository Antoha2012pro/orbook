import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getDayLessons, periods } from "../../shared/data/timetable";
import { useUserStore } from "../../shared/store/userStore";
import { formatDe, parseISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";

// ─────────────────────────────────────────────────────────────
// Шторка заметки.
//   ?sheet=notiz&datum=…&stunde=2  — заметка к уроку
//   ?sheet=notiz&datum=…&id=…      — изменить заметку на день
//   ?sheet=notiz&datum=…           — новая заметка на день
// ─────────────────────────────────────────────────────────────
const NoteSheet = ({ open, onClose, sheet }) => {
  const date = parseISODate(sheet.datum); // дата из адреса
  const period = sheet.stunde ? periods[Number(sheet.stunde) - 1] : null; // урок (если заметка к уроку)
  const lesson = date && period ? getDayLessons(date)[period.n - 1] : null; // сам урок

  // id заметки: к уроку — «дата#урок», на день — из адреса (или новая)
  const noteId = period ? `${sheet.datum}#${period.n}` : sheet.id;
  const note = useUserStore((s) => s.notes.find((n) => n.id === noteId)); // уже сохранённая заметка

  if (!date) return null; // кривой адрес

  // Подпись над заголовком: «2. Std · Mathe · Mi, 17.9.» или «Mittwoch, 17. September»
  const eyebrow = lesson
    ? `${period.n}. Std · ${fachName(lesson.fach)} · ${formatDe(date, "EEEEEE, d.M.")}`
    : formatDe(date, "EEEE, d. MMMM");

  return (
    <Sheet open={open} onClose={onClose} panelLabel="Notiz" eyebrow={eyebrow} title={note ? "Notiz bearbeiten" : "Neue Notiz"}>
      {/* key — при смене заметки форма создаётся заново с её текстом */}
      <NoteForm key={noteId ?? "neu"} note={note} noteId={noteId} date={sheet.datum} period={period?.n ?? null} onDone={onClose} />
    </Sheet>
  );
};

// Форма с полем ввода и кнопками
const NoteForm = ({ note, noteId, date, period, onDone }) => {
  const [text, setText] = useState(note?.text ?? ""); // текст в поле ввода
  const saveNote = useUserStore((s) => s.saveNote); // сохранить
  const deleteNote = useUserStore((s) => s.deleteNote); // удалить

  // Сохранение: закрываем сразу, «сервер» досинхронизирует в фоне
  const handleSubmit = (e) => {
    e.preventDefault(); // не перезагружать страницу
    if (!text.trim()) return; // пустую не сохраняем
    saveNote({ id: noteId, date, period, text: text.trim() });
    toast.success("Notiz gespeichert");
    onDone();
  };

  // Удаление
  const handleDelete = () => {
    deleteNote(noteId);
    toast("Notiz gelöscht");
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="px-1 text-label font-bold text-muted">Nur für dich sichtbar</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="z. B. Sportsachen mitnehmen"
          rows={4}
          autoFocus // сразу можно печатать
          className="w-full resize-none rounded-2xl bg-card p-3.5 text-body font-bold text-ink outline-none placeholder:text-faint focus:ring-2 focus:ring-accent/30"
        />
      </label>
      <div className="flex gap-2.5">
        {/* «Löschen» только для уже сохранённой заметки */}
        {note && (
          <Button onClick={handleDelete} className="text-danger">
            <Trash2 className="size-4.5" /> Löschen
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={!text.trim()}>
          Speichern
        </Button>
      </div>
    </form>
  );
};

export default NoteSheet;
