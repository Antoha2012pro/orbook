import { cn } from "../../shared/utils/cn";

// ─────────────────────────────────────────────────────────────
// Переключатель «Liste | Zeitleiste», «Heute | Morgen | Woche».
// options: [{ value, label, icon? }], value — выбранное, onChange(value)
// ─────────────────────────────────────────────────────────────
const Segmented = ({ options, value, onChange, label, className }) => {
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
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[13px] font-extrabold transition-colors",
              active ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {option.icon && <option.icon className="size-4" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default Segmented;
