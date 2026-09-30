import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "../api/api";

// ─────────────────────────────────────────────────────────────
// Хранилище того, что пользователь меняет сам:
// заметки, скрытые курсы, свои цвета предметов, показ выходных.
// persist сохраняет всё в localStorage (ключ "orbook-user"),
// поэтому после перезагрузки страницы данные остаются.
// Каждое изменение дополнительно отправляется на «сервер» (api.js — заглушки).
// ─────────────────────────────────────────────────────────────

// Отправить текущие настройки на сервер (не ждём ответа)
const syncPreferences = (state) => {
  api.savePreferences({
    hiddenCourses: state.hiddenCourses, // скрытые курсы
    colorOverrides: state.colorOverrides, // свои цвета
    showWeekend: state.showWeekend, // показывать ли выходные
  });
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      // ── состояние ──
      notes: [], // заметки: { id, date: "2025-09-17", period: 2 | null, text, updatedAt, synced }
      hiddenCourses: [], // скрытые курсы: ["GK-Ma1", …]
      colorOverrides: {}, // свои цвета: { mathe: "kunst" } — Mathe рисуется цветами Kunst
      showWeekend: false, // показывать Sa/So в сетке недели

      // ── заметки ──

      // Создать или обновить заметку. period = номер урока или null (заметка на день)
      saveNote: async ({ id, date, period = null, text }) => {
        // id: у заметки к уроку он постоянный («дата#урок»), у заметки на день — случайный
        const noteId = id ?? (period ? `${date}#${period}` : `${date}#${crypto.randomUUID()}`);
        const note = { id: noteId, date, period, text, updatedAt: Date.now(), synced: false }; // пока не синхронизирована
        // Сразу кладём заметку локально (интерфейс обновляется без ожидания сервера)
        set({ notes: [...get().notes.filter((n) => n.id !== noteId), note] });
        const saved = await api.saveNote(note); // отправляем на «сервер»
        // Сервер подтвердил — помечаем как синхронизированную
        set({ notes: get().notes.map((n) => (n.id === noteId ? { ...n, synced: saved.synced } : n)) });
        return noteId; // вернём id, если он понадобится
      },

      // Удалить заметку
      deleteNote: async (id) => {
        set({ notes: get().notes.filter((n) => n.id !== id) }); // убираем локально
        await api.deleteNote(id); // сообщаем «серверу»
      },

      // ── настройки ──

      // Скрыть курс (уроки этого курса больше не показываются)
      hideCourse: (course) => {
        if (get().hiddenCourses.includes(course)) return; // уже скрыт
        set({ hiddenCourses: [...get().hiddenCourses, course] }); // добавляем в список
        syncPreferences(get()); // отправляем на сервер
      },

      // Снова показать курс
      showCourse: (course) => {
        set({ hiddenCourses: get().hiddenCourses.filter((c) => c !== course) }); // убираем из списка
        syncPreferences(get()); // отправляем на сервер
      },

      // Показать все скрытые курсы
      showAllCourses: () => {
        set({ hiddenCourses: [] }); // очищаем список
        syncPreferences(get()); // отправляем на сервер
      },

      // Свой цвет для предмета. palette = ключ другого предмета или null (вернуть стандартный)
      setFachColor: (fach, palette) => {
        const next = { ...get().colorOverrides }; // копия объекта
        if (!palette || palette === fach) delete next[fach]; // стандартный цвет — просто удаляем запись
        else next[fach] = palette; // иначе запоминаем выбранную палитру
        set({ colorOverrides: next }); // сохраняем
        syncPreferences(get()); // отправляем на сервер
      },

      // Показать / скрыть выходные в сетке недели
      toggleWeekend: () => {
        set({ showWeekend: !get().showWeekend }); // переключаем
        syncPreferences(get()); // отправляем на сервер
      },
    }),
    { name: "orbook-user" }, // ключ в localStorage
  ),
);
