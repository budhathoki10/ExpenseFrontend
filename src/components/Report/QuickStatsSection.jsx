import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { formatMoney } from "./reportUtils.js";

const stats = (totalIncome, totalExpense, netBalance) => [
  {
    label: "Total Income",
    value: totalIncome,
    icon: <ArrowUpRight className="w-4 h-4" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-[#2d6a3f]",
    valueColor: "text-[#2d6a3f]",
  },
  {
    label: "Total Expense",
    value: totalExpense,
    icon: <ArrowDownRight className="w-4 h-4" />,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    valueColor: "text-red-500",
  },
  {
    label: "Savings",
    value: netBalance,
    icon: <Wallet className="w-4 h-4" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    valueColor: "text-blue-600",
  },
];

export default function QuickStatsSection({
  totalIncome,
  totalExpense,
  netBalance,
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-[#1a3328] mb-4">
        Expense Overview
      </h2>
      <div className="grid gap-3">
        {stats(totalIncome, totalExpense, netBalance).map(
          ({ label, value, icon, iconBg, iconColor, valueColor }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}
                >
                  {icon}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {label}
                </span>
              </div>
              <span className={`text-sm font-bold ${valueColor}`}>
                Rs. {formatMoney(value)}
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
