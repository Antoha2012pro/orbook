// Линия «сейчас». Кладётся в ту же строку сетки, что и текущий урок,
// и растягивается на все дни. top — сколько урока прошло.
// dayCount — сколько дней в сетке (5 или 7 с выходными)
const NowLine = ({ row, progress, todayIndex, dayCount = 5 }) => {
  return (
    <div
      className="pointer-events-none relative z-10"
      style={{ gridRow: row, gridColumn: `2 / ${dayCount + 2}` }} // от первого дня до последнего
    >
      <div className="absolute inset-x-0" style={{ top: `${progress * 100}%` }}>
        {/* тонкая линия через всю неделю */}
        <div className="h-px -translate-y-1/2 bg-accent/60" />

        {/* кружок + жирный отрезок в колонке сегодняшнего дня */}
        {todayIndex >= 0 && (
          <div
            className="absolute inset-x-0 top-0 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${dayCount}, minmax(0, 1fr))` }} // столько же колонок, сколько дней
          >
            <div className="relative" style={{ gridColumn: todayIndex + 1 }}>
              <div className="absolute inset-x-0 top-0 h-[3px] -translate-y-1/2 rounded-full bg-accent" />
              <div className="absolute top-0 -left-1 size-2.5 -translate-y-1/2 rounded-full bg-accent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NowLine;
