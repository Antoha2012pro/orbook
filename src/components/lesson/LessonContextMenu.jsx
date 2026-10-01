import * as ContextMenu from "@radix-ui/react-context-menu";
import { EyeOff, FileText, Info, Palette, Share } from "lucide-react";
import { toast } from "sonner";
import { periods } from "../../shared/data/timetable";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";
import { buildLessonText, shareText } from "../../shared/utils/share";
import Kbd from "../ui/Kbd";
import { menuContentClass, menuIconClass, menuItemClass, menuSeparatorClass } from "../ui/menuStyles";

// Подсказка клавиши справа в пункте меню (только на ПК, на телефоне скрыта)
const Shortcut = ({ children }) => <Kbd className="ml-auto hidden lg:inline-grid">{children}</Kbd>;

// ─────────────────────────────────────────────────────────────
// Контекстное меню урока.
// Открывается правой кнопкой мыши или долгим нажатием на телефоне —
// это умеет Radix ContextMenu сам.
// Пока меню открыто, работают клавиши: Enter — Details (или подсвеченный пункт), N — Notiz, S — Teilen.
// children — сам урок (кнопка), он становится «триггером» меню.
// ─────────────────────────────────────────────────────────────
const LessonContextMenu = ({ lesson, date, index, children }) => {
  const { openSheet } = useSheet(); // открыть шторку
  const hideCourse = useUserStore((s) => s.hideCourse); // скрыть курс
  const showCourse = useUserStore((s) => s.showCourse); // вернуть курс

  const period = periods[index]; // время урока
  const params = { datum: toISODate(date), stunde: period.n }; // параметры шторок этого урока

  // Действия меню
  const openDetails = () => openSheet("stunde", params);
  const openNote = () => openSheet("notiz", params);
  const share = () => shareText(buildLessonText(lesson, date, period));

  // «Kurs ausblenden» + уведомление с кнопкой «Rückgängig» (отменить)
  const handleHide = () => {
    hideCourse(lesson.course);
    toast(`${fachName(lesson.fach)} (${lesson.course}) ausgeblendet`, {
      action: { label: "Rückgängig", onClick: () => showCourse(lesson.course) },
    });
  };

  // Горячие клавиши внутри открытого меню.
  // Enter на подсвеченном пункте Radix обрабатывает сам; если ничего не подсвечено
  // (меню открыли мышью) — Enter открывает Details, как подсказывает ↵ на макете.
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const nothingHighlighted = event.target === event.currentTarget; // фокус на самом меню, а не на пункте
    const action = { n: openNote, s: share, enter: nothingHighlighted ? openDetails : null }[key]; // клавиша → действие
    if (!action) return;
    event.preventDefault();
    // У ContextMenu нет «закрыть из кода» — имитируем Esc, его Radix слушает на document
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    action();
  };

  return (
    <ContextMenu.Root>
      {/* asChild — меню вешается прямо на переданный урок, без лишней обёртки */}
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      {/* Portal — меню рисуется в конце <body>, поверх всего */}
      <ContextMenu.Portal>
        <ContextMenu.Content className={menuContentClass} onKeyDown={handleKeyDown}>
          <ContextMenu.Item className={menuItemClass} onSelect={openDetails}>
            <Info className={menuIconClass} /> Details <Shortcut>↵</Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={openNote}>
            <FileText className={menuIconClass} /> Notiz zur Stunde <Shortcut>N</Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={share}>
            <Share className={menuIconClass} /> Teilen <Shortcut>S</Shortcut>
          </ContextMenu.Item>

          <ContextMenu.Separator className={menuSeparatorClass} />

          <ContextMenu.Item className={menuItemClass} onSelect={() => openSheet("farbe", { fach: lesson.fach })}>
            <Palette className={menuIconClass} /> Fachfarbe ändern
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={handleHide}>
            <EyeOff className={menuIconClass} /> Kurs ausblenden
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default LessonContextMenu;
