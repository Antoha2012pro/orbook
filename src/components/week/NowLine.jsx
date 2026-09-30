// Линия «сейчас». Кладётся в ту же строку сетки, что и текущий урок,
// и растягивается на все 5 дней. top — сколько урока прошло.
const NowLine = ({ row, progress, todayIndex }) => {
  return (
    <div
      className="pointer-events-none relative z-10"
      style={{ gridRow: row, gridColumn: "2 / 7" }}
    >
      <div className="absolute inset-x-0" style={{ top: `${progress * 100}%` }}>
        {/* тонкая линия через всю неделю */}
        <div className="h-px -translate-y-1/2 bg-accent/60" />

        {/* кружок + жирный отрезок в колонке сегодняшнего дня */}
        {todayIndex >= 0 && (
          <div className="absolute inset-x-0 top-0 grid grid-cols-5 gap-1">
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