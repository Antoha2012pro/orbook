import { Info, Share } from "lucide-react";
import { getDayInfo } from "../../shared/data/timetable";
import { formatDe, parseISODate } from "../../shared/utils/dates";
import { shareText } from "../../shared/utils/share";
import { cn } from "../../shared/utils/cn";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";

// ─────────────────────────────────────────────────────────────
// Шторка «Info zum Tag» (скрин 4). Адрес: ?sheet=info&datum=2025-09-17
// ─────────────────────────────────────────────────────────────
const DayInfoSheet = ({ open, onClose, sheet }) => {
  const date = parseISODate(sheet.datum); // дата из адреса
  const info = date ? getDayInfo(date) : null; // информация дня

  if (!info) return null; // нет информации — нечего показывать

  // Текст для «Teilen»: дата + все абзацы
  const text = [formatDe(date, "EEEE, d. MMMM"), ...info.paragraphs, "via ORBook"].join("\n");

  return (
    <Sheet
      open={open}
      onClose={onClose}
      panelLabel="Info zum Tag"
      eyebrow={formatDe(date, "EEEE, d. MMMM")}
      title="Info zum Tag"
      footer={
        <Button onClick={() => shareText(text)}>
          <Share className="size-4.5" /> Teilen
        </Button>
      }
    >
      {/* абзацы информации */}
      {/* абзацы; последний (кто кого заменяет) — серым, как на макете */}
      <div className="flex flex-col gap-3 text-body font-bold text-ink lg:font-medium">
        {info.paragraphs.map((p, i) => (
          <p key={p} className={cn(i === info.paragraphs.length - 1 && i > 0 && "lg:text-muted")}>
            {p}
          </p>
        ))}
      </div>
      {/* откуда информация */}
      <p className="flex items-center gap-2 rounded-2xl bg-sand px-3.5 py-3 text-caption font-bold text-muted lg:text-label lg:font-medium">
        <Info className="size-4 shrink-0" /> {info.source}
      </p>
    </Sheet>
  );
};

export default DayInfoSheet;
