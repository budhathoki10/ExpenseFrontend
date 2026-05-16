import React from "react";
import { formatMoney, safeNumber } from "./reportUtils.js";

const DOT_COLORS = {
  red: "bg-red-400",
  green: "bg-emerald-300",
  amber: "bg-amber-300",
};

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

  const rows = [
    {
      dot: DOT_COLORS.red,
      label: "Highest spending",
      value: highestCategory
        ? `${highestCategory}${hiAmt > 0 ? ` — Rs. ${formatMoney(hiAmt)}` : ""}`
        : "—",
    },
    {
      dot: DOT_COLORS.green,
      label: "Lowest spending",
      value: lowestCategory
        ? `${lowestCategory}${loAmt > 0 ? ` — Rs. ${formatMoney(loAmt)}` : ""}`
        : "—",
    },
    {
      dot: DOT_COLORS.amber,
      label: "Suggestion",
      value: loading
        ? "Loading…"
        : hasData
          ? suggestion
          : "No data available for suggestions this week.",
    },
  ];

  return (
    <section className="bg-[#2d6a3f] rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-white mb-4">Insights</h3>
      <div className="space-y-3">
        {rows.map(({ dot, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <span
              className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`}
            />
            <p className="text-sm text-emerald-100 leading-snug">
              <span className="font-semibold text-white">{label}:</span> {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
