// Разделитель «Pause · 20 min» между уроками
const BreakRow = ({ minutes }) => (
  <div className="flex items-center gap-3 pl-14 text-[11px] font-bold text-faint">
    <span className="h-px flex-1 bg-hair" />
    Pause · {minutes} min
    <span className="h-px flex-1 bg-hair" />
  </div>
);

export default BreakRow;
