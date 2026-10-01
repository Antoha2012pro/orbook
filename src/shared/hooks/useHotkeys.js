import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// Горячие клавиши. Пример:
//   useHotkeys({ t: goToday, arrowleft: prevWeek, "mod+k": focusSearch })
// Ключ — event.key в нижнем регистре; "mod+" = ⌘ на Mac или Ctrl на Windows.
// Пока курсор в поле ввода или открыто окно/меню — клавиши без mod не срабатывают.
// ─────────────────────────────────────────────────────────────
export const useHotkeys = (bindings, enabled = true) => {
  const ref = useRef(bindings); // последние обработчики (без переподписки на каждый рендер)

  // Обновляем ref после рендера (а не во время него — так требует React)
  useEffect(() => {
    ref.current = bindings;
  });

  useEffect(() => {
    if (!enabled) return; // выключено — не слушаем

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase(); // "t", "arrowleft", "k"…
      const mod = event.metaKey || event.ctrlKey; // ⌘ или Ctrl
      const name = mod ? `mod+${key}` : key; // имя сочетания

      if (!mod) {
        if (event.altKey || event.shiftKey) return; // Alt/Shift — не наши сочетания
        const target = event.target; // где сейчас фокус
        const typing = target.closest?.("input, textarea, select, [contenteditable=true]"); // печатает в поле
        const overlay = document.querySelector("[role=dialog], [role=menu]"); // открыто окно или меню
        if (typing || overlay) return; // не мешаем вводу и окнам
      }

      const handler = ref.current[name]; // есть ли обработчик
      if (!handler) return;
      event.preventDefault(); // отменяем действие браузера (например, ⌘K)
      handler(event);
    };

    window.addEventListener("keydown", onKeyDown); // слушаем всю страницу
    return () => window.removeEventListener("keydown", onKeyDown); // отписка
  }, [enabled]);
};
