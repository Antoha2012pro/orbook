import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Calendar, CalendarCheck, CalendarRange, Check, Eye, List, MoreVertical, RefreshCw, Share } from "lucide-react";
import { toast } from "sonner";
import { reloadPlan } from "../../shared/api/api";
import { useSheet } from "../../shared/hooks/useSheet";
import { useUserStore } from "../../shared/store/userStore";
import { toISODate } from "../../shared/utils/dates";
import { menuContentClass, menuIconClass, menuItemClass, menuSeparatorClass } from "../ui/menuStyles";

// ─────────────────────────────────────────────────────────────
// Меню «⋮» у недели (скрин 6).
// weekStart — показываемая неделя, onToday — перейти на текущую неделю,
// onPickWeek — открыть календарь «Woche wählen»
// ─────────────────────────────────────────────────────────────
const WeekMenu = ({ weekStart, onToday, onPickWeek }) => {
  const navigate = useNavigate(); // переход на другую страницу
  const { openSheet } = useSheet(); // открыть шторку
  const showWeekend = useUserStore((s) => s.showWeekend); // выходные показаны?
  const toggleWeekend = useUserStore((s) => s.toggleWeekend); // переключить выходные
  const hiddenCount = useUserStore((s) => s.hiddenCourses.length); // сколько курсов скрыто
  const showAllCourses = useUserStore((s) => s.showAllCourses); // вернуть все курсы

  // «Plan neu laden»: toast.promise показывает «загрузка → готово/ошибка»
  const handleReload = () => {
    toast.promise(reloadPlan(), {
      loading: "Plan wird geladen…",
      success: "Plan ist aktuell",
      error: "Plan konnte nicht geladen werden",
    });
  };

  return (
    <DropdownMenu.Root>
      {/* кнопка «⋮»; asChild — используем свою кнопку вместо стандартной */}
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Weitere Optionen"
          className="flex size-9.5 items-center justify-center rounded-full bg-card data-[state=open]:bg-sand outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <MoreVertical className="size-4.25" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        {/* align="end" — меню выравнивается по правому краю кнопки */}
        <DropdownMenu.Content align="end" sideOffset={8} className={menuContentClass}>
          <DropdownMenu.Item className={menuItemClass} onSelect={onPickWeek}>
            <Calendar className={menuIconClass} /> Woche wählen
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={onToday}>
            <CalendarCheck className={menuIconClass} /> Zu heute springen
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => navigate("/heute")}>
            <List className={menuIconClass} /> Heute öffnen
          </DropdownMenu.Item>

          {/* пункт-галочка: сам показывает, включено ли */}
          <DropdownMenu.CheckboxItem className={menuItemClass} checked={showWeekend} onCheckedChange={toggleWeekend}>
            <CalendarRange className={menuIconClass} /> Wochenende anzeigen
            <DropdownMenu.ItemIndicator className="ml-auto text-accent">
              <Check className="size-4" strokeWidth={3} />
            </DropdownMenu.ItemIndicator>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className={menuSeparatorClass} />

          <DropdownMenu.Item className={menuItemClass} onSelect={handleReload}>
            <RefreshCw className={menuIconClass} /> Plan neu laden
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => openSheet("teilen", { bereich: "woche", kw: toISODate(weekStart) })}
          >
            <Share className={menuIconClass} /> Woche teilen
          </DropdownMenu.Item>

          {/* показываем, только если есть скрытые курсы */}
          {hiddenCount > 0 && (
            <>
              <DropdownMenu.Separator className={menuSeparatorClass} />
              <DropdownMenu.Item className={menuItemClass} onSelect={showAllCourses}>
                <Eye className={menuIconClass} /> Ausgeblendete Kurse zeigen ({hiddenCount})
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default WeekMenu;
