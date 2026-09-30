import { cn } from "../../shared/utils/cn";

// Кнопка для шторок: variant="primary" (фиолетовая) или "secondary" (светлая)
const Button = ({ variant = "secondary", className, children, ...props }) => {
  return (
    <button
      type="button" // по умолчанию не отправляет формы
      className={cn(
        "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-extrabold transition-opacity active:opacity-80 disabled:opacity-40",
        variant === "primary" ? "bg-accent text-on-accent" : "bg-sand text-ink",
        className, // можно дополнить снаружи
      )}
      {...props} // onClick, disabled, aria-* и т.д.
    >
      {children}
    </button>
  );
};

export default Button;
