import Badge from "./Badge";

// Бейдж по статусу урока: Vertretung / fällt aus / Klausur (или ничего)
const StatusBadge = ({ lesson, className }) => {
  if (lesson.status === "cancelled") return <Badge variant="cancelled" className={className}>fällt aus</Badge>;
  if (lesson.exam) return <Badge variant="exam" className={className}>Klausur</Badge>;
  if (lesson.status === "changed") return <Badge variant="changed" className={className}>Vertretung</Badge>;
  return null; // обычный урок — без бейджа
};

export default StatusBadge;
