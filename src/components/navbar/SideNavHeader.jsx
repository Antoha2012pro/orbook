import React from "react";
import Logo from "../ui/Logo";
import { PanelLeft } from "lucide-react";
import { cn } from "../../shared/utils/cn";

const SideNavHeader = ({ isHidden, onChangeIsHidden }) => {
  return (
    <header className="flex h-[43px] w-full shrink-0 items-center">
      <div
        className={cn(
          "flex min-w-0 items-center gap-2.25 overflow-hidden whitespace-nowrap",
          "transition-[max-width,opacity] duration-300 ease-out",
          isHidden ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100",
        )}
        aria-hidden={isHidden}
      >
        <Logo titleClassName="text-[22px]" />
        <span className="rounded-full bg-sand px-2 py-0.75 text-[10px] leading-none font-extrabold text-ink">
          8A
        </span>
      </div>

      <button
        type="button"
        onClick={() => onChangeIsHidden((prev) => !prev)}
        aria-label={
          isHidden ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"
        }
        className="ml-auto grid size-[28px] shrink-0 place-items-center rounded-full cursor-pointer text-faint transition-colors hover:bg-sand"
      >
        <PanelLeft className="size-4.5" />
      </button>
    </header>
  );
};

export default SideNavHeader;
