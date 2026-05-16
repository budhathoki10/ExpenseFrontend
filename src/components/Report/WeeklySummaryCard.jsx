import React from "react";

export default function WeeklySummaryCard({ loading, hasData, text }) {
  return (
    <section className="bg-[#2d6a3f] rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-white mb-3">
        Weekly Summary
      </h3>
      <p className="text-sm leading-relaxed text-emerald-100">
        {loading
          ? "Loading summary…"
          : hasData
            ? text
            : "There is no data for this weekly summary."}
      </p>
    </section>
  );
}
