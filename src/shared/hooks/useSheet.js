import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// Все параметры адреса, которые относятся к шторкам
const SHEET_KEYS = ["sheet", "datum", "stunde", "fach", "bereich", "kw", "id"];

// ─────────────────────────────────────────────────────────────
// Открытие/закрытие шторок через адрес страницы:
//   ?sheet=stunde&datum=2025-09-17&stunde=2
// Плюсы: кнопка «Назад» закрывает шторку, ссылку можно отправить.
// Шторки рисует <SheetHost /> (он читает эти параметры).
// ─────────────────────────────────────────────────────────────
export const useSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Открыть шторку name с параметрами. replace: true — не добавлять запись в историю
  const openSheet = useCallback(
    (name, params = {}, { replace = false } = {}) => {
      setSearchParams(
        (prev) => {
          SHEET_KEYS.forEach((key) => prev.delete(key)); // убираем параметры прошлой шторки
          prev.set("sheet", name); // какая шторка
          Object.entries(params).forEach(([key, value]) => {
            if (value != null) prev.set(key, String(value)); // её параметры
          });
          return prev;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  // Закрыть шторку (replace — чтобы «Назад» не открыл её снова)
  const closeSheet = useCallback(() => {
    setSearchParams(
      (prev) => {
        if (!prev.has("sheet")) return prev; // уже закрыта
        SHEET_KEYS.forEach((key) => prev.delete(key)); // убираем все параметры шторки
        return prev;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  // Текущая шторка и её параметры
  const sheet = {
    name: searchParams.get("sheet"), // "stunde" | "info" | "notiz" | "farbe" | "teilen" | "kalender" | null
    datum: searchParams.get("datum"),
    stunde: searchParams.get("stunde"),
    fach: searchParams.get("fach"),
    bereich: searchParams.get("bereich"),
    kw: searchParams.get("kw"), // понедельник недели для «kalender» и «teilen» (не путать с ?woche= у страницы недели)
    id: searchParams.get("id"),
  };

  return { sheet, openSheet, closeSheet };
};
