import { cn } from "../../shared/utils/cn";

// ─────────────────────────────────────────────────────────────
// Переключатель «Liste | Zeitleiste», «Heute | Morgen | Woche».
// options: [{ value, label, icon? }], value — выбранное, onChange(value)
// variant: "card" — выбранный белый (телефон), "accent" — выбранный фиолетовый (ПК)
// size: "md" — высота 36px, "sm" — 28px (компактный, как в шапке на ПК)
// iconOnly — показывать только иконки (подпись уходит в aria-label)
// ─────────────────────────────────────────────────────────────
const Segmented = ({ options, value, onChange, label, className, variant = "card", size = "md", iconOnly = false }) => {
  return (
    // role="group" + aria-label — скринридер прочитает, что это за переключатель
    <div role="group" aria-label={label} className={cn("flex rounded-full bg-sand p-1", className)}>
      {options.map((option) => {
        const active = option.value === value; // выбран ли этот вариант
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active} // «нажата» ли кнопка — для скринридера
            aria-label={iconOnly ? option.label : undefined} // подпись для варианта «только иконки»
            title={iconOnly ? option.label : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full text-label font-extrabold whitespace-nowrap transition-colors",
              size === "sm" ? "h-7 px-3" : "h-9 px-3",
              active
                ? variant === "accent"
                  ? "bg-accent text-on-accent" // ПК: фиолетовая «пилюля»
                  : "bg-card text-ink shadow-sm" // телефон: белая «пилюля»
                : "text-muted hover:text-ink",
            )}
          >
            {option.icon && <option.icon className="size-4 shrink-0" />}
            {!iconOnly && option.label}
          </button>
        );
      })}
    </div>
  );
};

export default Segmented;
