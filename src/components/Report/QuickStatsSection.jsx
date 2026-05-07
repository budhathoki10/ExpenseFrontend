import React from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatMoney } from "./reportUtils.js";

export default function QuickStatsSection({
  totalIncome,
  totalExpense,
  netBalance,
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a2b20]">Quick stats</h2>
      <div
        className="mt-3 rounded-2xl p-5"
        style={{ background: "rgba(47,92,43,0.55)" }}
      >
        <div className="grid gap-4">
          <div className="bg-white/95 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#1a2b20]">
                Total Income
              </div>
              <div className="text-sm text-gray-600">
                Rs. {formatMoney(totalIncome)}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-700" />
          </div>

          <div className="bg-white/95 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#1a2b20]">
                Total Expense
              </div>
              <div className="text-sm text-gray-600">
                Rs. {formatMoney(totalExpense)}
              </div>
            </div>
            <TrendingDown className="w-5 h-5 text-red-700" />
          </div>

          <div className="bg-white/95 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#1a2b20]">
                Net Balance
              </div>
              <div className="text-sm text-gray-600">
                Rs. {formatMoney(netBalance)}
              </div>
            </div>
            <Wallet className="w-5 h-5 text-green-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
