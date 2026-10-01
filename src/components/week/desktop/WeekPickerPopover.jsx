import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "lucide-react";
import { toISODate } from "../../../shared/utils/dates";
import WeekPicker from "../WeekPicker";

// ─────────────────────────────────────────────────────────────
// Кнопка 📅 + выпадающий календарь «Woche wählen» (ПК, макет «Woche wählen (Dropdown)»).
// weekStart — показываемая неделя; onPick(понедельник) — выбрали неделю
// ─────────────────────────────────────────────────────────────
const WeekPickerPopover = ({ weekStart, onPick, buttonClassName }) => {
  const [open, setOpen] = useState(false); // открыт ли календарь

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" aria-label="Woche wählen" className={buttonClassName}>
          <Calendar className="size-4.25" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={8}
          collisionPadding={16} // не вылезать за край экрана
          className="z-50 flex w-[360px] flex-col gap-4 rounded-[24px] bg-card p-4.5 shadow-2xl shadow-ink/15 outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          {/* key — при каждом открытии календарь начинается с показываемой недели */}
          <WeekPicker
            key={toISODate(weekStart)}
            initialWeek={weekStart}
            onOpenWeek={(monday) => {
              onPick(monday); // переходим на неделю
              setOpen(false); // и закрываем календарь
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default WeekPickerPopover;
