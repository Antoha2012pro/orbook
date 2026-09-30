import { Check } from "lucide-react";
import { fachSolid } from "../../shared/constants/fachColors";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { fachName } from "../../shared/utils/lessons";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";

// ─────────────────────────────────────────────────────────────
// Шторка «Fachfarbe ändern». Адрес: ?sheet=farbe&fach=mathe
// Выбираем одну из 8 палитр предметов — предмет будет рисоваться ею.
// ─────────────────────────────────────────────────────────────
const ColorSheet = ({ open, onClose, sheet }) => {
  const overrides = useUserStore((s) => s.colorOverrides); // свои цвета
  const setFachColor = useUserStore((s) => s.setFachColor); // сменить цвет

  const fach = sheet.fach; // для какого предмета
  if (!fachSolid[fach]) return null; // неизвестный предмет

  const current = overrides[fach] ?? fach; // выбранная сейчас палитра

  // Выбрать палитру и закрыть
  const choose = (palette) => {
    setFachColor(fach, palette);
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow={fachName(fach)}
      title="Fachfarbe ändern"
      footer={<Button onClick={() => choose(null)}>Standardfarbe</Button>}
    >
      {/* сетка 4×2 цветных кружков */}
      <div className="grid grid-cols-4 gap-3">
        {Object.keys(fachSolid).map((palette) => (
          <button
            key={palette}
            type="button"
            aria-pressed={palette === current} // выбран ли этот цвет
            onClick={() => choose(palette)}
            className="flex flex-col items-center gap-1.5 rounded-2xl py-2 transition-colors hover:bg-sand"
          >
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full text-white",
                fachSolid[palette],
                palette === current && "ring-3 ring-accent ring-offset-2 ring-offset-paper", // обводка у выбранного
              )}
            >
              {palette === current && <Check className="size-5" strokeWidth={3} />}
            </span>
            <span className="text-[11px] font-bold text-muted">{fachName(palette)}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
};

export default ColorSheet;
