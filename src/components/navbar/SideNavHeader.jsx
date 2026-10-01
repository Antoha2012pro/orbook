import { PanelLeft } from "lucide-react";
import Logo from "../ui/Logo";
import { cn } from "../../shared/utils/cn";
import { SCHOOL_CLASS } from "../../shared/data/timetable";

// Шапка сайдбара: логотип, класс («9B») и кнопка свернуть/развернуть
const SideNavHeader = ({ isHidden, onChangeIsHidden }) => {
  return (
    <header className="flex h-[43px] w-full shrink-0 items-center">
      {/* логотип + класс; при сворачивании плавно уезжают (max-width → 0) */}
      <div
        className={cn(
          "flex min-w-0 items-center gap-2.25 overflow-hidden whitespace-nowrap",
          "transition-[max-width,opacity] duration-300 ease-out",
          isHidden ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100",
        )}
        aria-hidden={isHidden}
      >
        <Logo className="items-center gap-2" titleClassName="text-logo" withIcon />
        <span className="rounded-full bg-sand px-2 py-0.75 text-micro leading-none font-extrabold text-ink uppercase">
          {SCHOOL_CLASS}
        </span>
      </div>

      {/* свернуть / развернуть */}
      <button
        type="button"
        onClick={() => onChangeIsHidden((prev) => !prev)}
        aria-label={isHidden ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
        className="ml-auto grid size-[43px] shrink-0 cursor-pointer place-items-center rounded-full text-faint transition-colors hover:bg-sand"
      >
        <PanelLeft className="size-4.5" />
      </button>
    </header>
  );
};

export default SideNavHeader;
