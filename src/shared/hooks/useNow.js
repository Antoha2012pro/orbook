import { useEffect, useState } from "react";

// Текущее время, обновляется раз в минуту
export const useNow = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return now;
};