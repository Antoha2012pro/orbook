import { useEffect, useRef } from "react";
import { cn } from "../../shared/utils/cn";
import DayDetails from "./DayDetails";

// Телефон — шторка снизу, desktop — окно по центру.
const DayModal = ({ day, onClose }) => {
  const ref = useRef(null);

  // day есть → открыть, нет → закрыть
  useEffect(() => {
    const dialog = ref.current;
    if (day && !dialog.open) dialog.showModal();
    if (!day && dialog.open) dialog.close();
  }, [day]);

  return (
    <dialog
      ref={ref}
      // Esc закрывает dialog сам — сообщаем наверх
      onClose={onClose}
      // клик по затемнению (по самому dialog, а не по содержимому)
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        "m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-paper p-0 text-ink",
        "desktop:m-auto desktop:max-w-md desktop:rounded-3xl",
        "backdrop:bg-ink/40",
      )}
    >
      {day && <DayDetails day={day} onClose={onClose} />}
    </dialog>
  );
};

export default DayModal;