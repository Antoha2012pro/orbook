import { NotebookPen, Share } from "lucide-react";
import { getDayLessons, periods } from "../../shared/data/timetable";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { parseISODate } from "../../shared/utils/dates";
import { fachClasses, fachName } from "../../shared/utils/lessons";
import { buildLessonText, shareText } from "../../shared/utils/share";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";
import StatusBadge from "../ui/StatusBadge";

// Строка «Lehrer / Raum / Kurs / Info»
const Row = ({ label, children }) => (
  <div className="flex gap-4 py-3">
    <dt className="w-16 shrink-0 text-[14px] font-bold text-faint">{label}</dt>
    <dd className="min-w-0 flex-1 text-[14px] font-bold text-ink">{children}</dd>
  </div>
);

// Новое значение + зачёркнутое старое: «Kle ~~Mü~~»
const Changed = ({ value, original }) => (
  <>
    <span className={cn(original && "font-extrabold text-accent-ink")}>{value}</span>
    {original && <s className="ml-2 font-bold text-faint">{original}</s>}
  </>
);

// ─────────────────────────────────────────────────────────────
// Шторка урока (скрин 3). Параметры из адреса: ?sheet=stunde&datum=…&stunde=2
// ─────────────────────────────────────────────────────────────
const LessonSheet = ({ open, onClose, sheet }) => {
  const { openSheet } = useSheet(); // чтобы открыть шторку заметки
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета предметов
  const note = useUserStore((s) => s.notes.find((n) => n.id === `${sheet.datum}#${sheet.stunde}`)); // заметка к уроку

  const date = parseISODate(sheet.datum); // дата из адреса
  const index = Number(sheet.stunde) - 1; // номер урока → индекс в массиве
  const period = periods[index]; // время урока
  const lesson = date && period ? getDayLessons(date)[index] : null; // сам урок

  if (!lesson) return null; // кривой адрес — ничего не показываем

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow={`${period.n}. Stunde · ${period.start}–${period.end}`}
      title={fachName(lesson.fach)}
      titleAside={<StatusBadge lesson={lesson} />}
      // кружок с сокращением предмета в его цвете
      icon={
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full text-[14px] font-black",
            fachClasses(lesson.fach, overrides),
          )}
        >
          {lesson.short}
        </span>
      }
      footer={
        <>
          {/* replace: true — «Назад» из заметки не вернёт в эту шторку */}
          <Button onClick={() => openSheet("notiz", { datum: sheet.datum, stunde: sheet.stunde }, { replace: true })}>
            <NotebookPen className="size-4.5" /> Notiz
          </Button>
          <Button onClick={() => shareText(buildLessonText(lesson, date, period))}>
            <Share className="size-4.5" /> Teilen
          </Button>
        </>
      }
    >
      {/* dl — список «название: значение» */}
      <dl className="divide-y divide-hair rounded-2xl bg-card px-4">
        <Row label="Lehrer">
          <Changed value={lesson.teacher} original={lesson.originalTeacher} />
        </Row>
        <Row label="Raum">
          <Changed value={lesson.room} original={lesson.originalRoom} />
        </Row>
        <Row label="Kurs">{lesson.course}</Row>
        {lesson.exam && <Row label="Klausur">{lesson.topic ?? "—"}</Row>}
        {lesson.info && <Row label="Info">{lesson.info}</Row>}
      </dl>

      {/* Своя заметка к уроку, если есть */}
      {note && (
        <div className="rounded-2xl bg-tint p-4 text-[14px] font-bold whitespace-pre-wrap text-ink">
          <p className="mb-1 text-[11px] font-extrabold text-accent-ink uppercase">Meine Notiz</p>
          {note.text}
        </div>
      )}
    </Sheet>
  );
};

export default LessonSheet;
