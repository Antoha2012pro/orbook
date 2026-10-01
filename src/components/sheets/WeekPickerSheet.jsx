import { useNavigate } from "react-router-dom";
import { parseISODate, toISODate } from "../../shared/utils/dates";
import Sheet from "../ui/Sheet";
import WeekPicker from "../week/WeekPicker";

// ─────────────────────────────────────────────────────────────
// Шторка «Woche wählen» (телефон). Адрес: ?sheet=kalender&kw=2025-09-15
// На ПК календарь открывается выпадающим окном у кнопки 📅 (WeekPickerPopover).
// ─────────────────────────────────────────────────────────────
const WeekPickerSheet = ({ open, onClose, sheet }) => {
  const navigate = useNavigate(); // переход на неделю

  return (
    <Sheet open={open} onClose={onClose} desktop="dialog" title="Woche wählen">
      {/* key — при новом открытии календарь начинается с переданной недели */}
      <WeekPicker
        key={sheet.kw}
        initialWeek={parseISODate(sheet.kw)}
        // переход на неделю (параметры шторки уходят из адреса — она закроется)
        onOpenWeek={(monday) => navigate(`/woche?woche=${toISODate(monday)}`)}
      />
    </Sheet>
  );
};

export default WeekPickerSheet;
