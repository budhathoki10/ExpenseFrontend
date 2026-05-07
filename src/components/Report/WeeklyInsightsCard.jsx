import React from "react";
import { formatMoney, safeNumber } from "./reportUtils.js";

export default function WeeklyInsightsCard({
  loading,
  hasData,
  highestCategory,
  highestAmount,
  lowestCategory,
  lowestAmount,
  suggestion,
}) {
  const hiAmt = safeNumber(highestAmount);
  const loAmt = safeNumber(lowestAmount);

  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: "rgba(47,92,43,0.55)" }}
    >
      <h3 className="text-xl font-semibold text-[#0b1f14]">Insights</h3>

      <div className="mt-4 space-y-3 text-sm text-[#0b1f14]">
        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-red-600" />
          <div>
            <span className="font-semibold">Highest spending:</span>{" "}
            {highestCategory}
            {hiAmt > 0 ? ` (Rs. ${formatMoney(hiAmt)})` : ""}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-green-600" />
          <div>
            <span className="font-semibold">Lowest spending:</span>{" "}
            {lowestCategory}
            {loAmt > 0 ? ` (Rs. ${formatMoney(loAmt)})` : ""}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-yellow-500" />
          <div>
            <span className="font-semibold">Suggestion:</span>{" "}
            {loading
              ? "Loading…"
              : hasData
                ? suggestion
                : "No data available for suggestions this week."}
          </div>
        </div>
      </div>
    </section>
  );
}
