import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getUpcomingExams } from "../../shared/data/timetable";
import { useNow } from "../../shared/hooks/useNow";
import { cn } from "../../shared/utils/cn";
import { isTabActive } from "../../shared/utils/isTabActive";
import { navTabs } from "../../shared/constants/constants";
import NavigationLink from "./NavigationLink";
import QuickSearch from "./QuickSearch";
import SideNavFooter from "./SideNavFooter";
import SideNavHeader from "./SideNavHeader";
import SoonList from "./SoonList";

// ─────────────────────────────────────────────────────────────
// Сайдбар на компьютере (≥ 1024px), как на макете:
//   логотип + класс · поиск ⌘K · меню (у «Testen» счётчик) · «Bald»
//   · «Einstellungen» · статус плана · тема · «Admin»
// Сворачивается кнопкой в шапке до 71px (только иконки).
// ─────────────────────────────────────────────────────────────
const SideNav = () => {
  const { pathname } = useLocation(); // текущий адрес — для подсветки пунктов
  const now = useNow(); // текущее время
  const [isHidden, setIsHidden] = useState(false); // свёрнут ли сайдбар

  const examCount = getUpcomingExams(now).length; // счётчик у «Testen»

  return (
    <aside
      className={cn(
        // sticky: сайдбар остаётся на месте при прокрутке; высота = экран − 2×16px
        "sticky top-4 my-4 hidden h-[calc(100dvh-2rem)] shrink-0 flex-col overflow-hidden rounded-[24px] bg-card px-3.5 pt-4 pb-3.5 lg:flex print:hidden",
        "transition-[width] duration-300 ease-out",
        isHidden ? "w-[71px]" : "w-[232px]",
      )}
    >
      <SideNavHeader isHidden={isHidden} onChangeIsHidden={setIsHidden} />

      <div className="mt-4">
        <QuickSearch collapsed={isHidden} onExpand={() => setIsHidden(false)} />
      </div>

      <nav className="mt-5 space-y-1">
        {navTabs
          .filter((t) => t.desktop)
          .map((tab) => (
            <NavigationLink
              key={tab.to}
              active={isTabActive(tab, pathname)}
              tab={tab}
              isHidden={isHidden}
              badge={tab.to === "/testen" ? examCount : null} // число ближайших Klausuren
            />
          ))}
      </nav>

      {/* «Bald» только в развёрнутом виде */}
      {!isHidden && <SoonList />}

      <SideNavFooter collapsed={isHidden} />
    </aside>
  );
};

export default SideNav;
