import React from "react";

const highlights = [
  { label: "Budgets balanced", value: "12k+" },
  { label: "Weekly check-ins", value: "42k" },
  { label: "Coffee skipped", value: "87k" },
];

export default function AboutUs() {
  return (
    <section className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full bg-[#1b1b1b] border border-[#2c2c2c] rounded-3xl p-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.4em] text-[#6ea16a] mb-6">
          OUR WHY
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-[#d1f5ce] mb-6">
          Spend less time stressing about money and more time enjoying it.
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed mb-10">
          Spend Wise trims the noise out of budgeting. We nudge you with gentle
          reminders, readable charts, and weekly wins so every swipe lines up
          with your bigger story.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="bg-[#232323] rounded-2xl border border-[#2f2f2f] px-5 py-6 text-center"
            >
              <p className="text-3xl font-semibold text-[#8bd488]">
                {item.value}
              </p>
              <p className="text-xs uppercase tracking-wide text-gray-400 mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
