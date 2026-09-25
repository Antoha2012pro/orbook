import { Link, useLocation } from "react-router-dom";
import { navTabs } from "../../shared/constants";
import { cn } from "../../shared/utils/cn";
import { useState } from "react";
import { Search } from "lucide-react";
import SideNavHeader from "./SideNavHeader";
import { isTabActive } from "../../shared/utils/isTabActive";
import NavigationLink from "./NavigationLink";

const SideNav = () => {
  const [searchValue, setSearchValue] = useState("");
  const { pathname } = useLocation();

  const [isHidden, setIsHidden] = useState(false);
  console.log(isHidden);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col gap-5 overflow-hidden rounded-[20px] bg-card px-3.5 py-8 my-4 desktop:flex",
        "transition-[width] duration-300 ease-out",
        isHidden ? "w-[71px]" : "w-[232px]",
      )}
    >
      <SideNavHeader isHidden={isHidden} onChangeIsHidden={setIsHidden} />
      <div className="relative h-10 shrink-0">
        <Search className="pointer-events-none absolute top-1/2 left-[13.5px] size-4 -translate-y-1/2 text-faint" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => isHidden && setIsHidden(false)}
          placeholder="Suchen"
          aria-label="Suchen"
          className={cn(
            "h-full w-full min-w-0 rounded-full bg-paper pl-10 text-ink outline-none focus:ring-2 focus:ring-accent/30",
            "transition-[color,padding] duration-300 ease-out placeholder:transition-colors",
            isHidden
              ? "pr-0 placeholder:text-transparent"
              : "pr-4 placeholder:text-faint placeholder:delay-150",
          )}
        />
      </div>
      <nav className="space-y-1">
        {navTabs
          .filter((t) => t.desktop)
          .map((tab) => {
            const active = isTabActive(tab, pathname);

            return (
              <NavigationLink
                key={tab.to}
                active={active}
                tab={tab}
                isHidden={isHidden}
              />
            );
          })}
      </nav>
    </aside>
  );
};

export default SideNav;
