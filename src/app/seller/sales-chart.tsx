"use client";

import { useState } from "react";

interface SalesChartProps {
  data: { day: number; value: number | null }[];
}

const X_AXIS_LABELS = [1, 5, 10, 15, 20, 25, 31];

export function SalesChart({ data }: SalesChartProps) {
  const [tooltip, setTooltip] = useState<{ day: number; value: number } | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value ?? 0), 1);

  return (
    <div className="relative">
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-cream-light text-[11px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
          {tooltip.value.toLocaleString("pl-PL")} zł
        </div>
      )}

      {/* Bars */}
      <div className="flex items-end gap-0.5 h-40">
        {data.map(({ day, value }) => {
          const pct = value !== null ? (value / maxValue) * 100 : 8;
          const hasData = value !== null;
          return (
            <div
              key={day}
              className="flex-1 flex items-end cursor-pointer group"
              style={{ height: "100%" }}
              onMouseEnter={() => hasData && value !== null && setTooltip({ day, value })}
              onMouseLeave={() => setTooltip(null)}
            >
              <div
                className={`w-full rounded-t transition-opacity ${
                  hasData ? "bg-charcoal group-hover:opacity-70" : "bg-black/10"
                }`}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex mt-1 text-[10px] text-warm-gray relative">
        {data.map(({ day }) => {
          const show = X_AXIS_LABELS.includes(day);
          // position as percentage
          const leftPct = ((day - 1) / 30) * 100;
          return show ? (
            <span
              key={day}
              className="absolute -translate-x-1/2"
              style={{ left: `${leftPct}%` }}
            >
              {day}
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
}
