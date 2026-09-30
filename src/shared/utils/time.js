// "10:30" → 630 (минут от полуночи)
export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Где сейчас линия: { index, progress } или null (до/после уроков)
// index — номер урока (0…), progress — сколько прошло от урока (0…1)
export const getNowPosition = (periods, date) => {
  const now = date.getHours() * 60 + date.getMinutes();

  for (let i = 0; i < periods.length; i++) {
    const start = toMinutes(periods[i].start);
    const end = toMinutes(periods[i].end);

    if (now < start) {
      // перемена перед уроком i — линия в самом верху урока
      return i === 0 ? null : { index: i, progress: 0 };
    }
    if (now <= end) {
      return { index: i, progress: (now - start) / (end - start) };
    }
  }
  return null;
};

// Урок уже закончился?
export const isPeriodPast = (period, day, now) => {
  const end = new Date(day);
  const [h, m] = period.end.split(":").map(Number);
  end.setHours(h, m, 0, 0);
  return end < now;
};

// Урок идёт прямо сейчас?
export const isPeriodNow = (period, day, now) => {
  const start = new Date(day);
  const end = new Date(day);
  const [sh, sm] = period.start.split(":").map(Number);
  const [eh, em] = period.end.split(":").map(Number);
  start.setHours(sh, sm, 0, 0);
  end.setHours(eh, em, 0, 0);
  return start <= now && now <= end;
};
// Date дня + "10:30" → Date с этим временем
export const atTime = (day, hhmm) => {
  const date = new Date(day); // копия, чтобы не менять исходную дату
  const [h, m] = hhmm.split(":").map(Number); // часы и минуты
  date.setHours(h, m, 0, 0); // ставим время
  return date;
};

// Минуты от полуночи для Date
export const minutesOfDay = (date) => date.getHours() * 60 + date.getMinutes();
