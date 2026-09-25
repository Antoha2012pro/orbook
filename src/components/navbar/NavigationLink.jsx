import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../shared/utils/cn";

const NavigationLink = ({ active, tab, isHidden = false, className = '', iconClassName = '', textClassName = '' }) => {
  return (
    <Link
      to={tab.to}
      aria-current={active ? "page" : undefined}
      title={isHidden ? tab.label : undefined}
      className={cn(
        "flex h-[42px] items-center gap-3 overflow-hidden rounded-full px-3 text-[15px] font-bold transition-colors",
        active ? "bg-accent text-on-accent" : "text-muted hover:bg-sand",
        className
      )}
    >
      <>
        <tab.icon className={cn("size-5 shrink-0", iconClassName)} />
        <span
          className={cn(
            "flex-1 whitespace-nowrap transition-opacity ease-out text-[13px] font-extrabold leading-none",
            isHidden
              ? "opacity-0 duration-150"
              : "opacity-100 duration-200 delay-150",
            textClassName
          )}
        >
          {tab.label}
        </span>
      </>
    </Link>
  );
};

export default NavigationLink;
