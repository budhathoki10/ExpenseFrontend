import React from "react";

const DOT_COLORS = {
  red: "bg-red-400",
  green: "bg-emerald-300",
  amber: "bg-amber-300",
  blue: "bg-blue-300",
};

export default function InsightsCard({
  hasData,
  highestCategory,
  lowestCategory,
  suggestion,
  opportunity,
}) {
  const rows = [
    {
      dot: DOT_COLORS.red,
      label: "Highest spending",
      value: highestCategory || "—",
    },
    {
      dot: DOT_COLORS.green,
      label: "Lowest spending",
      value: lowestCategory || "—",
    },
    {
      dot: DOT_COLORS.amber,
      label: "Suggestion",
      value: hasData
        ? suggestion
        : "No data available for suggestions this month.",
    },
    {
      dot: DOT_COLORS.blue,
      label: "Opportunity",
      value: hasData
        ? opportunity
        : "No data available for opportunities this month.",
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
