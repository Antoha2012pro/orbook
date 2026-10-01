import { useSyncExternalStore } from "react";

// true, если media query совпадает: useMediaQuery("(min-width: 90rem)")
// useSyncExternalStore подписывается на изменения ширины окна
export const useMediaQuery = (query) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query); // объект media query
      media.addEventListener("change", onChange); // сообщаем React об изменениях
      return () => media.removeEventListener("change", onChange); // отписка
    },
    () => window.matchMedia(query).matches, // текущее значение
  );

// Компьютерный вид (сайдбар, панели справа) — с 1024px (брейкпоинт lg)
export const DESKTOP_QUERY = "(min-width: 64rem)";

// Широкий экран — макет 1:1 с правой колонкой (брейкпоинт desktop из index.css, 1440px)
export const WIDE_QUERY = "(min-width: 90rem)";
