import { useState } from "react";
import { useSheet } from "../../shared/hooks/useSheet";
import ColorSheet from "./ColorSheet";
import DayInfoSheet from "./DayInfoSheet";
import LessonSheet from "./LessonSheet";
import NoteSheet from "./NoteSheet";
import ShareSheet from "./ShareSheet";
import WeekPickerSheet from "./WeekPickerSheet";

// Какое имя в адресе (?sheet=…) какой шторке соответствует
const SHEETS = {
  stunde: LessonSheet, // детали урока
  info: DayInfoSheet, // Info zum Tag
  notiz: NoteSheet, // заметка
  farbe: ColorSheet, // Fachfarbe ändern
  teilen: ShareSheet, // Teilen
  kalender: WeekPickerSheet, // Woche wählen
};

// ─────────────────────────────────────────────────────────────
// Рисует шторку, указанную в адресе. Лежит один раз в HomePage,
// поэтому шторки работают на любой странице.
// ─────────────────────────────────────────────────────────────
const SheetHost = () => {
  const { sheet, closeSheet } = useSheet(); // текущая шторка из адреса

  // Пока шторка закрывается (анимация), параметров в адресе уже нет.
  // Поэтому запоминаем последние параметры и показываем их до конца анимации.
  const [last, setLast] = useState(sheet);
  if (sheet.name && JSON.stringify(sheet) !== JSON.stringify(last)) {
    setLast(sheet); // React разрешает так обновлять состояние из новых данных во время рендера
  }

  const shown = sheet.name ? sheet : last; // что рисуем
  const Component = SHEETS[shown.name]; // компонент шторки
  if (!Component) return null; // шторок ещё не открывали / неизвестное имя

  return (
    <Component
      key={shown.name} // другая шторка — новый компонент
      open={sheet.name === shown.name} // открыта, пока имя есть в адресе
      onClose={closeSheet}
      sheet={shown}
    />
  );
};

export default SheetHost;
