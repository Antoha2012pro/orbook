import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Calendar, CalendarCheck, CalendarRange, Check, Eye, List, MoreVertical, Printer, RefreshCw, Share } from "lucide-react";
import { DESKTOP_QUERY, useMediaQuery } from "../../shared/hooks/useMediaQuery";
import { useSheet } from "../../shared/hooks/useSheet";
import { usePlanStore } from "../../shared/store/planStore";
import { useUserStore } from "../../shared/store/userStore";
import { toISODate } from "../../shared/utils/dates";
import Kbd from "../ui/Kbd";
import { menuContentClass, menuIconClass, menuItemClass, menuSeparatorClass } from "../ui/menuStyles";

// ─────────────────────────────────────────────────────────────
// Меню «⋮» у недели.
//   Телефон: Woche wählen, Zu heute springen, Heute öffnen, Wochenende, Plan neu laden, Woche teilen
//   ПК (макет «Woche · Menü»): Zu heute springen T, Tagesansicht D, Wochenende,
//                              Plan neu laden R, Woche teilen, Drucken ⌘P
//   (сами клавиши T / D / R работают на странице недели — см. useHotkeys в Week.jsx)
// weekStart — показываемая неделя, onToday — перейти на текущую неделю,
// onPickWeek — открыть календарь «Woche wählen» (только телефон)
// ─────────────────────────────────────────────────────────────
const WeekMenu = ({ weekStart, onToday, onPickWeek }) => {
  const navigate = useNavigate(); // переход на другую страницу
  const isDesktop = useMediaQuery(DESKTOP_QUERY); // ПК или телефон
  const { openSheet } = useSheet(); // открыть шторку
  const showWeekend = useUserStore((s) => s.showWeekend); // выходные показаны?
  const toggleWeekend = useUserStore((s) => s.toggleWeekend); // переключить выходные
  const hiddenCount = useUserStore((s) => s.hiddenCourses.length); // сколько курсов скрыто
  const showAllCourses = useUserStore((s) => s.showAllCourses); // вернуть все курсы
  const reloadPlan = usePlanStore((s) => s.reload); // «Plan neu laden»

  // Подсказка клавиши справа в пункте (только на ПК)
  const shortcut = (key) => isDesktop && <Kbd className="ml-auto">{key}</Kbd>;

  return (
    <DropdownMenu.Root>
      {/* кнопка «⋮»; asChild — используем свою кнопку вместо стандартной */}
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Weitere Optionen"
          className="flex size-9.5 items-center justify-center rounded-full bg-card outline-none data-[state=open]:bg-sand focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <MoreVertical className="size-4.25" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        {/* align="end" — меню выравнивается по правому краю кнопки */}
        <DropdownMenu.Content align="end" sideOffset={8} className={menuContentClass}>
          {/* на ПК календарь — отдельная кнопка 📅 в шапке, в меню он не нужен */}
          {!isDesktop && (
            <DropdownMenu.Item className={menuItemClass} onSelect={onPickWeek}>
              <Calendar className={menuIconClass} /> Woche wählen
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item className={menuItemClass} onSelect={onToday}>
            <CalendarCheck className={menuIconClass} /> Zu heute springen {shortcut("T")}
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => navigate("/heute")}>
            <List className={menuIconClass} /> {isDesktop ? "Tagesansicht" : "Heute öffnen"} {shortcut("D")}
          </DropdownMenu.Item>

          {/* пункт-галочка: сам показывает, включено ли */}
          <DropdownMenu.CheckboxItem className={menuItemClass} checked={showWeekend} onCheckedChange={toggleWeekend}>
            <CalendarRange className={menuIconClass} /> Wochenende anzeigen
            <DropdownMenu.ItemIndicator className="ml-auto text-accent">
              <Check className="size-4" strokeWidth={3} />
            </DropdownMenu.ItemIndicator>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className={menuSeparatorClass} />

          <DropdownMenu.Item className={menuItemClass} onSelect={reloadPlan}>
            <RefreshCw className={menuIconClass} /> Plan neu laden {shortcut("R")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => openSheet("teilen", { bereich: "woche", kw: toISODate(weekStart) })}
          >
            <Share className={menuIconClass} /> Woche teilen
          </DropdownMenu.Item>
          {/* «Drucken» — системная печать браузера (только ПК) */}
          {isDesktop && (
            <DropdownMenu.Item className={menuItemClass} onSelect={() => window.print()}>
              <Printer className={menuIconClass} /> Drucken {shortcut("⌘P")}
            </DropdownMenu.Item>
          )}

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
