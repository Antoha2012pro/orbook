import * as ContextMenu from "@radix-ui/react-context-menu";
import { EyeOff, Info, NotebookPen, Palette, Share } from "lucide-react";
import { toast } from "sonner";
import { periods } from "../../shared/data/timetable";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { toISODate } from "../../shared/utils/dates";
import { fachName } from "../../shared/utils/lessons";
import { buildLessonText, shareText } from "../../shared/utils/share";
import { menuContentClass, menuIconClass, menuItemClass, menuSeparatorClass } from "../ui/menuStyles";

// ─────────────────────────────────────────────────────────────
// Контекстное меню урока (скрин 5).
// Открывается правой кнопкой мыши или долгим нажатием на телефоне —
// это умеет Radix ContextMenu сам.
// children — сам урок (кнопка), он становится «триггером» меню.
// ─────────────────────────────────────────────────────────────
const LessonContextMenu = ({ lesson, date, index, children }) => {
  const { openSheet } = useSheet(); // открыть шторку
  const hideCourse = useUserStore((s) => s.hideCourse); // скрыть курс
  const showCourse = useUserStore((s) => s.showCourse); // вернуть курс

  const period = periods[index]; // время урока
  const params = { datum: toISODate(date), stunde: period.n }; // параметры шторок этого урока

  // «Kurs ausblenden» + уведомление с кнопкой «Rückgängig» (отменить)
  const handleHide = () => {
    hideCourse(lesson.course);
    toast(`${fachName(lesson.fach)} (${lesson.course}) ausgeblendet`, {
      action: { label: "Rückgängig", onClick: () => showCourse(lesson.course) },
    });
  };

  return (
    <ContextMenu.Root>
      {/* asChild — меню вешается прямо на переданный урок, без лишней обёртки */}
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      {/* Portal — меню рисуется в конце <body>, поверх всего */}
      <ContextMenu.Portal>
        <ContextMenu.Content className={menuContentClass}>
          <ContextMenu.Item className={menuItemClass} onSelect={() => openSheet("stunde", params)}>
            <Info className={menuIconClass} /> Details
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={() => openSheet("notiz", params)}>
            <NotebookPen className={menuIconClass} /> Notiz zur Stunde
          </ContextMenu.Item>
          <ContextMenu.Item className={menuItemClass} onSelect={() => shareText(buildLessonText(lesson, date, period))}>
            <Share className={menuIconClass} /> Teilen
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
