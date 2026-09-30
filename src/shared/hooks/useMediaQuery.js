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

// Десктоп = брейкпоинт desktop из index.css (90rem = 1440px)
export const DESKTOP_QUERY = "(min-width: 90rem)";
