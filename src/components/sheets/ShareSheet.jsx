import { useState } from "react";
import { Copy, MessageCircle } from "lucide-react";
import { useNow } from "../../shared/hooks/useNow";
import { parseISODate } from "../../shared/utils/dates";
import { buildShareText, copyText, whatsappUrl } from "../../shared/utils/share";
import Button from "../ui/Button";
import Segmented from "../ui/Segmented";
import Sheet from "../ui/Sheet";

// Варианты переключателя
const RANGES = [
  { value: "heute", label: "Heute" },
  { value: "morgen", label: "Morgen" },
  { value: "woche", label: "Woche" },
];

// ─────────────────────────────────────────────────────────────
// Шторка «Teilen» (скрин 8). Адрес: ?sheet=teilen&bereich=morgen[&kw=2025-09-15]
// Собирает текст про Vertretungen и Klausuren, его можно поправить
// и отправить в WhatsApp или скопировать.
// ─────────────────────────────────────────────────────────────
const ShareSheet = ({ open, onClose, sheet }) => {
  return (
    <Sheet open={open} onClose={onClose} eyebrow="Nachricht auf Deutsch" title="Teilen">
      {/* key — при новом открытии с другим «bereich» настройки начинаются заново */}
      <ShareOptions key={`${sheet.bereich}-${sheet.kw}`} initialRange={sheet.bereich} weekStart={parseISODate(sheet.kw)} />
    </Sheet>
  );
};

// Переключатель + галочки
const ShareOptions = ({ initialRange, weekStart }) => {
  const now = useNow(); // текущее время (для «heute/morgen»)
  const [range, setRange] = useState(RANGES.some((r) => r.value === initialRange) ? initialRange : "heute"); // период
  const [includeChanges, setIncludeChanges] = useState(true); // галочка «Vertretungen»
  const [includeExams, setIncludeExams] = useState(true); // галочка «Klausuren»

  // Текст, собранный по настройкам
  const generated = buildShareText({ range, includeChanges, includeExams, now, weekStart });

  return (
    <>
      <Segmented label="Zeitraum" options={RANGES} value={range} onChange={setRange} />

      {/* галочки */}
      <div className="grid grid-cols-2 gap-2">
        <Checkbox label="Vertretungen" checked={includeChanges} onChange={setIncludeChanges} />
        <Checkbox label="Klausuren" checked={includeExams} onChange={setIncludeExams} />
      </div>

      {/* key — при смене настроек поле ввода получает новый текст */}
      <Composer key={generated} initialText={generated} />
    </>
  );
};

// Галочка с подписью
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-card px-3.5 py-3 text-[14px] font-bold text-ink">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="size-4.5 accent-accent" // accent-* красит системную галочку
    />
    {label}
  </label>
);

// Поле с текстом (можно править) + кнопки отправки
const Composer = ({ initialText }) => {
  const [text, setText] = useState(initialText); // текст, который отправим

  return (
    <>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        aria-label="Nachricht"
        className="w-full resize-none rounded-2xl bg-ok-tint p-3.5 text-[14px] leading-relaxed font-bold text-ink outline-none focus:ring-2 focus:ring-ok/40"
      />
      <p className="-mt-2 px-1 text-[12px] font-bold text-faint">Du kannst den Text vor dem Senden noch ändern.</p>

      <div className="flex gap-2.5">
        <Button onClick={() => copyText(text)}>
          <Copy className="size-4.5" /> Kopieren
        </Button>
        {/* обычная ссылка в новой вкладке: откроет WhatsApp (приложение или web) */}
        <a
          href={whatsappUrl(text)}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-extrabold text-on-accent active:opacity-80"
        >
          <MessageCircle className="size-4.5" /> WhatsApp
        </a>
      </div>
    </>
  );
};

export default ShareSheet;
