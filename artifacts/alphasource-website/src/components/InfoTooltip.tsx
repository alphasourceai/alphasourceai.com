import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  side?: "top" | "bottom";
  iconClassName?: string;
}

export default function InfoTooltip({
  content,
  side = "bottom",
  iconClassName = "w-3 h-3 text-[#0A1547]/25",
}: InfoTooltipProps) {
  return (
    <span className="relative group/tip inline-flex items-center cursor-default">
      <Info className={iconClassName} />
      <span
        className={[
          "pointer-events-none absolute z-50 w-48 rounded-xl px-3 py-2.5",
          "bg-[#0A1547] text-white text-[11px] font-medium leading-snug shadow-xl",
          "opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150",
          "left-1/2 -translate-x-1/2",
          side === "top"
            ? "bottom-full mb-2"
            : "top-full mt-2",
        ].join(" ")}
        role="tooltip"
      >
        {content}
        {/* Arrow */}
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
            side === "top"
              ? "top-full border-t-[#0A1547]"
              : "bottom-full border-b-[#0A1547]",
          ].join(" ")}
        />
      </span>
    </span>
  );
}
