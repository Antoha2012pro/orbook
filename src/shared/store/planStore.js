import { create } from "zustand";
import { toast } from "sonner";
import { reloadPlan } from "../api/api";

// ─────────────────────────────────────────────────────────────
// Состояние расписания с «сервера»: когда оно обновлялось.
// Нужно для «Plan aktuell · Stand 07:12» в сайдбаре и «Plan neu laden».
// Не сохраняется в localStorage — при каждом запуске берём с сервера.
// ─────────────────────────────────────────────────────────────

// ЗАГЛУШКА: «сервер» обновил план сегодня в 07:12
const initialUpdatedAt = () => {
  const date = new Date(); // сегодня
  date.setHours(7, 12, 0, 0); // 07:12
  return date;
};

export const usePlanStore = create((set) => ({
  updatedAt: initialUpdatedAt(), // время последнего обновления
  loading: false, // идёт ли загрузка прямо сейчас

  // «Plan neu laden»: уведомление «загрузка → готово» и новое время
  reload: () => {
    set({ loading: true });
    const request = reloadPlan().then((result) => {
      set({ updatedAt: result.updatedAt, loading: false }); // сервер ответил
      return result;
    });
    request.catch(() => set({ loading: false })); // ошибка — просто перестаём крутить
    toast.promise(request, {
      loading: "Plan wird geladen…",
      success: "Plan ist aktuell",
      error: "Plan konnte nicht geladen werden",
    });
  },
}));
