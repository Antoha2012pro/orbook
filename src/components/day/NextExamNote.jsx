import { Link } from "react-router-dom";
import { Flag } from "lucide-react";
import { getNextExam } from "../../shared/data/timetable";
import { formatDe, relativeDays, toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";

// Плашка «In 2 Tagen: Klausur Mathe am Freitag, 1. Stunde» (под «Zeitleiste»)
const NextExamNote = ({ now }) => {
  const exam = getNextExam(now); // ближайшая Klausur
  if (!exam) return null; // Klausuren нет

  const when = relativeDays(exam.date, now); // «in 2 Tagen»
  return (
    <Link
      to={`/tag/${toISODate(exam.date)}`}
      className="flex items-center gap-3 rounded-2xl bg-tint px-4 py-3.5 text-label font-bold text-accent-ink"
    >
      <Flag className="size-4.5 shrink-0" />
      <span>
        <span className="font-black">{when.charAt(0).toUpperCase() + when.slice(1)}:</span> Klausur{" "}
        {fachName(exam.lesson.fach)} am {formatDe(exam.date, "EEEE")}, {exam.period.n}. Stunde
      </span>
    </Link>
  );
};

export default NextExamNote;
