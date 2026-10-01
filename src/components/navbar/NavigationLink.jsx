import { Link } from "react-router-dom";
import { cn } from "../../shared/utils/cn";

// ─────────────────────────────────────────────────────────────
// Пункт меню сайдбара: иконка + подпись (+ счётчик справа).
// isHidden — сайдбар свёрнут: подпись прозрачная, видна только иконка
// badge — число справа (например, 5 у «Testen»); null — без счётчика
// ─────────────────────────────────────────────────────────────
const NavigationLink = ({ active, tab, isHidden = false, badge = null, className = "", iconClassName = "", textClassName = "" }) => {
  return (
    <Link
      to={tab.to}
      aria-current={active ? "page" : undefined}
      title={isHidden ? tab.label : undefined} // подсказка в свёрнутом виде
      className={cn(
        "flex h-[42px] items-center gap-3 overflow-hidden rounded-full px-3 text-body font-semibold transition-colors",
        active ? "bg-accent font-bold text-on-accent" : "text-ink/80 hover:bg-sand",
        className,
      )}
    >
      <tab.icon className={cn("size-5 shrink-0", iconClassName)} />
      <span
        className={cn(
          "flex-1 whitespace-nowrap transition-opacity ease-out",
          isHidden ? "opacity-0 duration-150" : "opacity-100 delay-150 duration-200",
          textClassName,
        )}
      >
        {tab.label}
      </span>
      {/* счётчик */}
      {badge > 0 && !isHidden && (
        <span
          className={cn(
            "grid h-5 min-w-5.5 place-items-center rounded-full px-1.5 text-caption font-extrabold",
            active ? "bg-on-accent/20 text-on-accent" : "bg-sand text-muted",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export default NavigationLink;
