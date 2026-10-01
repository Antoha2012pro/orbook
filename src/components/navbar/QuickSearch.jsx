import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { addDays, startOfISOWeek } from "date-fns";
import { CalendarDays, Flag, NotebookPen, Search } from "lucide-react";
import { getDayLessons, getUpcomingExams, periods } from "../../shared/data/timetable";
import { useHotkeys } from "../../shared/hooks/useHotkeys";
import { useNow } from "../../shared/hooks/useNow";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { cn } from "../../shared/utils/cn";
import { formatDe, parseISODate, toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";
import Kbd from "../ui/Kbd";

// Сколько результатов показывать максимум
const MAX_RESULTS = 8;

// ─────────────────────────────────────────────────────────────
// Собираем всё, по чему можно искать: уроки этой недели, Klausuren, заметки.
// Каждый элемент: { id, icon, title, subtitle, haystack (текст для поиска), action }
// ─────────────────────────────────────────────────────────────
const buildIndex = (now, notes, { openSheet, navigate }) => {
  const items = [];
  const monday = startOfISOWeek(now); // понедельник этой недели

  // Уроки Mo–Fr этой недели
  for (let d = 0; d < 5; d++) {
    const date = addDays(monday, d); // день недели
    getDayLessons(date).forEach((lesson, index) => {
      if (!lesson) return; // пустой урок
      const period = periods[index]; // время урока
      items.push({
        id: `l-${toISODate(date)}-${period.n}`,
        icon: CalendarDays,
        title: `${fachName(lesson.fach)} · ${formatDe(date, "EEEEEE")} ${period.n}. Std`,
        subtitle: `${lesson.teacher} · Raum ${lesson.room} · ${lesson.course}`,
        haystack: [fachName(lesson.fach), lesson.teacher, lesson.room, lesson.course, formatDe(date, "EEEE")].join(" "),
        action: () => openSheet("stunde", { datum: toISODate(date), stunde: period.n }), // открыть урок
      });
    });
  }

  // Ближайшие Klausuren / Tests
  getUpcomingExams(now).forEach(({ date, lesson, period }) => {
    const type = lesson.examType === "test" ? "Test" : "Klausur"; // вид
    items.push({
      id: `e-${toISODate(date)}-${period.n}`,
      icon: Flag,
      title: `${type} · ${fachName(lesson.fach)}`,
      subtitle: `${formatDe(date, "EEEEEE, d. MMMM")} · ${period.n}. Std${lesson.topic ? ` · ${lesson.topic}` : ""}`,
      haystack: [type, fachName(lesson.fach), lesson.topic, "Klausur Test"].join(" "),
      action: () => navigate(`/tag/${toISODate(date)}`), // страница дня
    });
  });

  // Свои заметки
  notes.forEach((note) => {
    items.push({
      id: `n-${note.id}`,
      icon: NotebookPen,
      title: note.text.split("\n")[0], // первая строка заметки
      subtitle: `Notiz · ${formatDe(parseISODate(note.date), "EEEEEE, d. MMMM")}`,
      haystack: `${note.text} Notiz`,
      action: () =>
        openSheet("notiz", note.period ? { datum: note.date, stunde: note.period } : { datum: note.date, id: note.id }),
    });
  });

  return items;
};

// ─────────────────────────────────────────────────────────────
// Быстрый поиск в сайдбаре. ⌘K / Ctrl+K — курсор в поле.
// Стрелки ↑↓ — выбор, Enter — открыть, Esc — закрыть.
// collapsed — сайдбар свёрнут (тогда клик по полю его разворачивает)
// ─────────────────────────────────────────────────────────────
const QuickSearch = ({ collapsed, onExpand }) => {
  const inputRef = useRef(null); // поле ввода (для ⌘K)
  const [query, setQuery] = useState(""); // что ввели
  const [active, setActive] = useState(0); // какой результат подсвечен
  const now = useNow(); // текущее время
  const notes = useUserStore((s) => s.notes); // заметки
  const { openSheet } = useSheet(); // открыть шторку
  const navigate = useNavigate(); // переход на страницу

  // ⌘K / Ctrl+K — фокус в поиск (и развернуть сайдбар)
  useHotkeys({
    "mod+k": () => {
      onExpand();
      inputRef.current?.focus();
    },
  });

  // Ищем: каждое слово запроса должно встречаться в тексте элемента
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length
    ? buildIndex(now, notes, { openSheet, navigate })
        .filter((item) => words.every((w) => item.haystack.toLowerCase().includes(w)))
        .slice(0, MAX_RESULTS)
    : [];

  // Выбрать результат: выполнить действие и очистить поиск
  const choose = (item) => {
    item.action();
    setQuery("");
    inputRef.current?.blur();
  };

  // Клавиши внутри поля
  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1)); // вниз
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0)); // вверх
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      choose(results[active]); // открыть выбранное
    } else if (event.key === "Escape") {
      setQuery(""); // очистить
      inputRef.current?.blur();
    }
  };

  return (
    <Popover.Root open={words.length > 0}>
      {/* Anchor — к чему «прикреплён» список результатов */}
      <Popover.Anchor asChild>
        <div className="relative h-10 shrink-0">
          <Search className="pointer-events-none absolute top-1/2 left-[13.5px] size-4 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0); // новый запрос — подсветка на первом
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => collapsed && onExpand()} // свёрнут — развернуть
            placeholder="Suchen"
            aria-label="Suchen"
            role="combobox"
            aria-expanded={words.length > 0}
            className={cn(
              "h-full w-full min-w-0 rounded-full bg-paper pl-10 text-body text-ink outline-none focus:ring-2 focus:ring-accent/30",
              "transition-[color,padding] duration-300 ease-out placeholder:transition-colors",
              collapsed ? "pr-0 placeholder:text-transparent" : "pr-12 placeholder:text-faint placeholder:delay-150",
            )}
          />
          {/* подсказка ⌘K справа в поле */}
          {!collapsed && <Kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>}
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()} // фокус остаётся в поле ввода
          onInteractOutside={() => setQuery("")} // клик мимо — закрыть
          className="z-50 w-[340px] rounded-2xl border border-hair bg-card p-1.5 shadow-xl shadow-ink/10 data-[state=open]:animate-pop-in"
        >
          {results.length === 0 && <p className="px-3 py-2.5 text-body-sm font-bold text-faint">Nichts gefunden</p>}
          <ul role="listbox">
            {results.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)} // наведение мышью тоже подсвечивает
                  onClick={() => choose(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left",
                    i === active && "bg-sand",
                  )}
                >
                  <item.icon className="size-4.5 shrink-0 text-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sm font-bold text-ink">{item.title}</span>
                    <span className="block truncate text-caption font-semibold text-faint">{item.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default QuickSearch;
