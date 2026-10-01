import { format } from "date-fns";
import { usePlanStore } from "../../../shared/store/planStore";

// ─────────────────────────────────────────────────────────────
// Карточка «Info zum Tag» в правой колонке дня (ПК):
// первые два абзаца + «Alles» (открывает панель со всем текстом).
// ─────────────────────────────────────────────────────────────
const DayInfoCard = ({ info, onOpen }) => {
  const updatedAt = usePlanStore((s) => s.updatedAt); // когда обновлялся план

  return (
    <section className="rounded-[24px] bg-card p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-label font-extrabold text-faint">Info zum Tag</h2>
        <button type="button" onClick={onOpen} className="text-label font-extrabold text-accent">
          Alles
        </button>
      </header>
      <div className="mt-2.5 flex flex-col gap-2.5 text-body font-medium text-ink">
        {info.paragraphs.slice(0, 2).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-2.5 text-caption font-semibold text-faint">Aus dem Vertretungsplan · Stand {format(updatedAt, "HH:mm")}</p>
    </section>
  );
};

export default DayInfoCard;
