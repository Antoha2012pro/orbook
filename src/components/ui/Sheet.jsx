import { Drawer } from "vaul";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../shared/utils/cn";
import { DESKTOP_QUERY, useMediaQuery } from "../../shared/hooks/useMediaQuery";

// ─────────────────────────────────────────────────────────────
// Общая шторка.
//   Телефон  — шторка снизу (vaul): с «ручкой», смахивается пальцем вниз.
//   Десктоп  — окно по центру (Radix Dialog).
// Обе библиотеки сами дают: затемнение, закрытие по Esc и клику
// по фону, фокус внутри окна, блокировку прокрутки страницы.
//
// Пропсы:
//   open, onClose — открыта ли шторка и что делать при закрытии
//   eyebrow       — маленькая строка над заголовком
//   title         — заголовок (обязателен для скринридеров)
//   titleAside    — что-то справа от заголовка (например, бейдж)
//   icon          — кружок слева от заголовка
//   footer        — кнопки внизу
// ─────────────────────────────────────────────────────────────
const Sheet = ({ open, onClose, eyebrow, title, titleAside, icon, footer, children }) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY); // какой вариант показывать

  // Библиотеки сообщают об открытии/закрытии через onOpenChange(true/false)
  const handleOpenChange = (next) => {
    if (!next) onClose(); // закрыли (Esc, фон, смахивание) — сообщаем наверх
  };

  // Шапка одинаковая в обоих вариантах; Title/Description — компоненты нужной библиотеки
  const renderHeader = (Title, Description, Close) => (
    <header className="flex items-start gap-3">
      {icon}
      <div className="min-w-0 flex-1">
        {/* Description — подпись для скринридера (здесь это eyebrow) */}
        <Description className={cn("text-[12px] leading-4 font-extrabold text-faint", !eyebrow && "sr-only")}>
          {eyebrow || title}
        </Description>
        <div className="flex flex-wrap items-center gap-2">
          <Title className="text-[26px] leading-tight font-black text-ink">{title}</Title>
          {titleAside}
        </div>
      </div>
      {/* Крестик закрытия */}
      <Close
        aria-label="Schließen"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-muted transition-colors hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <X className="size-4.5" />
      </Close>
    </header>
  );

  // Содержимое без шапки
  const body = (
    <>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
      {footer && <div className="mt-5 flex gap-2.5">{footer}</div>}
    </>
  );

  // ── Десктоп: окно по центру ──
  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          {/* затемнение фона */}
          <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
          {/* само окно: по центру через top/left 50% и translate -50% */}
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-1/2 overflow-y-auto rounded-[28px] bg-paper p-5 shadow-2xl outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in">
            {renderHeader(Dialog.Title, Dialog.Description, Dialog.Close)}
            {body}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  // ── Телефон: шторка снизу ──
  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      <Drawer.Portal>
        {/* затемнение фона */}
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        {/* шторка прижата к низу; vaul сам анимирует выезд и смахивание */}
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-paper outline-none">
          {/* «ручка» сверху — за неё удобно тянуть */}
          <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-faint2" />
          {/* прокручиваемая часть; снизу учитываем полоску жестов iPhone */}
          <div className="overflow-y-auto px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {renderHeader(Drawer.Title, Drawer.Description, Drawer.Close)}
            {body}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Sheet;
