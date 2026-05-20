import React, { useMemo } from "react";

export default function ExpenseStatistics({
  expenseStats,
  totalExpense,
  transactions,
}) {
  // Prefer backend pie-chart aggregation; fallback to client aggregation if unavailable.
  const fallbackFromTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { expenseStats: [], totalExpense: 0 };
    }
    const agg = {};
    transactions.forEach((t) => {
      const kind = (t.type || t.transactionType || "").toString().toLowerCase();
      if (kind !== "expense") return;
      const cat = t.category || t.categoryName || t.raw?.category || "Other";
      const amt = Number(t.amount) || Number(t.total) || 0;
      if (!agg[cat]) agg[cat] = 0;
      agg[cat] += amt;
    });
    const arr = Object.entries(agg).map(([category, amount]) => ({
      category,
      amount,
    }));
    const total = arr.reduce((s, it) => s + it.amount, 0);
    return { expenseStats: arr, totalExpense: total };
  }, [transactions]);

  const sourceStats =
    expenseStats && expenseStats.length > 0
      ? expenseStats
      : fallbackFromTransactions.expenseStats;
  const sourceTotal =
    Number(totalExpense) > 0
      ? Number(totalExpense)
      : fallbackFromTransactions.totalExpense;
  const pieColors = [
    "#16a34a",
    "#eab308",
    "#3b82f6",
    "#ef4444",
    "#a855f7",
    "#ec4899",
    "#f97316",
  ];
  const maxVisibleCategories = 8;
  const displayStats = useMemo(() => {
    const sortedStats = (sourceStats || [])
      .map((stat) => ({
        ...stat,
        amount: Number(stat.amount) || 0,
      }))
      .filter((stat) => stat.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    if (sortedStats.length <= maxVisibleCategories) {
      return sortedStats;
    }

    const visibleStats = sortedStats.slice(0, maxVisibleCategories - 1);
    const otherAmount = sortedStats
      .slice(maxVisibleCategories - 1)
      .reduce((sum, stat) => sum + stat.amount, 0);

    return [...visibleStats, { category: "Others", amount: otherAmount }];
  }, [sourceStats]);
  const displayTotal =
    Number(sourceTotal) > 0
      ? Number(sourceTotal)
      : displayStats.reduce((sum, stat) => sum + stat.amount, 0);
  const hasData = displayStats.length > 0 && displayTotal > 0;

  return (
    <div className="p-1 h-[430px] flex flex-col relative">
      <div className="mb-4 mt-1">
        <span className="text-sm font-medium">Spending Monthly Overview</span>
      </div>
      <div className="flex-1 flex items-center justify-between">
        {/* Left: Donut chart with center total */}
        <div className="flex items-center gap-6 pl-2">
          <div className="relative w-56 h-56">
            {/* build background from slices or fallback */}
            <div
              className="w-56 h-56 rounded-full"
              style={{
                background:
                  (hasData &&
                    (() => {
                      const useStats = displayStats;
                      const total = displayTotal || 1;
                      let cur = 0;
                      const stops = (useStats || [])
                        .map((stat, idx) => {
                          const pct = ((stat.amount || 0) / (total || 1)) * 100;
                          const start = cur;
                          const end = cur + pct;
                          cur = end;
                          return `${pieColors[idx % pieColors.length]} ${start}% ${end}%`;
                        })
                        .join(", ");
                      return useStats.length > 0
                        ? `conic-gradient(${stops})`
                        : "conic-gradient(#e5e7eb 0% 100%)";
                    })()) ||
                  "conic-gradient(#e5e7eb 0% 100%)",
                transform: "rotate(-45deg)",
              }}
            ></div>

            {/* center hole */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-sm font-semibold">
                Rs.
                {Math.round(
                  displayTotal ||
                    (displayStats || []).reduce(
                      (s, it) => s + (it.amount || 0),
                      0,
                    ) ||
                    0,
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right: category list with percentages and amounts */}
        <div className="pr-2 flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="flex-1 flex flex-col justify-start pt-2">
            {(displayStats || [])
              .map((it, idx) => {
                const total =
                  displayTotal ||
                    (displayStats || []).reduce(
                      (s, ii) => s + (ii.amount || 0),
                      0,
                    ) ||
                    1;
                const pct = total ? ((it.amount || 0) / total) * 100 : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-white/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full ml-8"
                        style={{
                          background: pieColors[idx % pieColors.length],
                        }}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {it.category}
                        </div>
                                <div className="text-xs text-gray-500">
                                  {pct >= 1
                                    ? `${Math.round(pct)}%`
                                    : pct > 0
                                    ? "<1%"
                                    : "0%"}
                                </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold mr-4">
                      Rs.{Number(it.amount).toLocaleString()}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
