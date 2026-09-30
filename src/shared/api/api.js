// ─────────────────────────────────────────────────────────────
// Слой «сервера». Сейчас это ЗАГЛУШКИ: они отвечают с небольшой
// задержкой, как настоящий сервер. Когда появится бэкенд —
// меняешь тело функций на fetch(...), а компоненты не трогаешь.
// ─────────────────────────────────────────────────────────────

// Адрес будущего сервера (задаётся в .env как VITE_API_URL=https://...)
export const API_URL = import.meta.env.VITE_API_URL ?? "";

// Имитация сетевой задержки: Promise, который выполнится через ms миллисекунд
const fakeDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// «Plan neu laden» — перезагрузить расписание с сервера
export const reloadPlan = async () => {
  // Потом здесь будет: const res = await fetch(`${API_URL}/plan`); return res.json();
  await fakeDelay(700); // делаем вид, что ждём ответ сервера
  return { updatedAt: new Date() }; // сервер вернул бы время обновления
};

// Сохранить заметку (создать или изменить)
export const saveNote = async (note) => {
  // Потом: await fetch(`${API_URL}/notes/${note.id}`, { method: "PUT", body: JSON.stringify(note) })
  await fakeDelay(); // ждём «сервер»
  return { ...note, synced: true }; // сервер подтвердил сохранение
};

// Удалить заметку
export const deleteNote = async (id) => {
  // Потом: await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" })
  await fakeDelay(); // ждём «сервер»
  return { ok: true, id }; // удаление подтверждено
};

// Сохранить настройки пользователя (скрытые курсы, цвета, выходные)
export const savePreferences = async (prefs) => {
  // Потом: await fetch(`${API_URL}/preferences`, { method: "PUT", body: JSON.stringify(prefs) })
  await fakeDelay(); // ждём «сервер»
  return { ok: true, prefs }; // настройки приняты
};
