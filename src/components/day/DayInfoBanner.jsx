import { ChevronRight, Info } from "lucide-react";

// Плашка «Info zum Tag: …» — по клику открывается шторка с подробностями
const DayInfoBanner = ({ info, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-sand px-3.5 py-3 text-left text-label font-bold text-ink"
    >
      <Info className="size-4.5 shrink-0 text-muted" />
      <p className="min-w-0 flex-1">
        <span className="font-black">Info zum Tag:</span> {info.short}
      </p>
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </button>
  );
};

export default DayInfoBanner;
