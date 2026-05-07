import React from "react";

export default function WeeklySummaryCard({ loading, hasData, text }) {
  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: "rgba(47,92,43,0.55)" }}
    >
      <h3 className="text-xl font-semibold text-[#0b1f14]">Weekly Summary</h3>
      <p className="mt-4 text-sm leading-relaxed text-[#0b1f14] opacity-95">
        {loading
          ? "Loading summary…"
          : hasData
            ? text
            : "There is no data for this weekly summary."}
      </p>
    </section>
  );
}
