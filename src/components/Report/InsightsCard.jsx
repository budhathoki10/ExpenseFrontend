import React from "react";

export default function InsightsCard({
  hasData,
  highestCategory,
  lowestCategory,
  suggestion,
  opportunity,
}) {
  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: "rgba(47,92,43,0.55)" }}
    >
      <h3 className="text-xl font-semibold text-[#0b1f14]">Insights</h3>

      <div className="mt-4 space-y-3 text-sm text-[#0b1f14] opacity-95">
        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-red-600" />
          <div>
            <span className="font-semibold">Highest spending:</span>{" "}
            {highestCategory || "—"}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-green-600" />
          <div>
            <span className="font-semibold">Lowest spending:</span>{" "}
            {lowestCategory || "—"}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-yellow-500" />
          <div>
            <span className="font-semibold">Suggestion:</span>{" "}
            {hasData
              ? suggestion
              : "No data available for suggestions this month."}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
          <div>
            <span className="font-semibold">Opportunity:</span>{" "}
            {hasData
              ? opportunity
              : "No data available for opportunities this month."}
          </div>
        </div>
      </div>
    </section>
  );
}
