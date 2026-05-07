import { useEffect, useMemo, useState } from "react";
import { fetchTransactions } from "./reportApi.js";
import { safeNumber } from "./reportUtils.js";

function startOfDayLocal(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

function getWeekStartSaturday(now = new Date()) {
  const d = startOfDayLocal(now);
  // JS: 0=Sun..6=Sat. We want the most recent Saturday (inclusive).
  const dow = d.getDay();
  const offset = (dow + 1) % 7; // Sun->1 ... Fri->6, Sat->0
  d.setDate(d.getDate() - offset);
  return d;
}

function dayLabelFromDate(date) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return labels[date.getDay()] || "";
}

function computeWeeklyFromTransactions(transactions) {
  const weekStart = getWeekStartSaturday(new Date());
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  const expenseByCategory = {};

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return {
      date: d,
      label: dayLabelFromDate(d),
      income: 0,
      expense: 0,
    };
  });

  (transactions || []).forEach((it) => {
    const dateStr = it.Date || it.date || it.createdAt || "";
    const dt = dateStr ? new Date(dateStr) : null;
    if (!dt || Number.isNaN(dt.getTime())) return;

    const local = startOfDayLocal(dt);
    if (local < weekStart || local >= nextWeekStart) return;

    const idx = Math.floor((local.getTime() - weekStart.getTime()) / 86400000);
    if (idx < 0 || idx > 6) return;

    const type = String(it.type || it.transactionType || "").toLowerCase();
    const amt = safeNumber(it.amount || it.total || 0);

    if (type === "income") {
      days[idx].income += amt;
    } else if (type === "expense") {
      days[idx].expense += amt;

      const cat = it.category || it.categoryName || "Other";
      expenseByCategory[cat] = safeNumber(expenseByCategory[cat]) + amt;
    }
  });

  const totalIncome = days.reduce((s, d) => s + safeNumber(d.income), 0);
  const totalExpense = days.reduce((s, d) => s + safeNumber(d.expense), 0);
  const netBalance = totalIncome - totalExpense;

  const highest = days.reduce(
    (best, d) => (d.expense > (best?.expense ?? -1) ? d : best),
    null,
  );
  const lowest = days
    .filter((d) => safeNumber(d.expense) > 0)
    .reduce(
      (best, d) => (d.expense < (best?.expense ?? Infinity) ? d : best),
      null,
    );

  const weekendExpense =
    safeNumber(days[0]?.expense) + safeNumber(days[1]?.expense); // Sat+Sun
  const weekdayExpense = days
    .slice(2)
    .reduce((s, d) => s + safeNumber(d.expense), 0);

  const suggestion =
    weekendExpense > weekdayExpense / 2
      ? "Reduce weekend spendings"
      : "Try keeping expenses consistent across the week.";

  const weeklySummary = (() => {
    const hiDay =
      highest && safeNumber(highest.expense) > 0 ? highest.label : null;
    const lead =
      "This week, your spending showed noticeable variation across different days.";
    const mid = hiDay
      ? ` The highest expenses occurred on ${hiDay}, indicating possible lifestyle or discretionary spending during these periods.`
      : "";
    const close =
      totalIncome > 0
        ? " Your income remained relatively stable, with consistent deposits throughout the week."
        : "";

    const end =
      totalExpense > totalIncome
        ? " Overall, your financial activity suggests higher spending than income — consider reducing expenses on high-spending days to improve balance and savings."
        : " Overall, your financial activity suggests moderate spending habits — keep an eye on high-spending days to improve balance and savings.";

    return `${lead}${mid}${close}${end}`.trim();
  })();

  const catRows = Object.entries(expenseByCategory)
    .map(([category, amount]) => ({ category, amount: safeNumber(amount) }))
    .filter((x) => x.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const topCat = catRows[0] || null;
  const bottomCat = catRows.length > 1 ? catRows[catRows.length - 1] : null;

  return {
    weekStart,
    days,
    totalIncome,
    totalExpense,
    netBalance,
    highestExpenseDay:
      highest && safeNumber(highest.expense) > 0 ? highest.label : "—",
    lowestExpenseDay: lowest ? lowest.label : "—",
    highestExpenseCategory: topCat?.category || "—",
    highestExpenseCategoryAmount: topCat?.amount || 0,
    lowestExpenseCategory: bottomCat?.category || "—",
    lowestExpenseCategoryAmount: bottomCat?.amount || 0,
    weeklySummary,
    suggestion,
  };
}

export function useWeeklyReportData({ enabled = true } = {}) {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [highestExpenseDay, setHighestExpenseDay] = useState("—");
  const [lowestExpenseDay, setLowestExpenseDay] = useState("—");
  const [highestExpenseCategory, setHighestExpenseCategory] = useState("—");
  const [highestExpenseCategoryAmount, setHighestExpenseCategoryAmount] =
    useState(0);
  const [lowestExpenseCategory, setLowestExpenseCategory] = useState("—");
  const [lowestExpenseCategoryAmount, setLowestExpenseCategoryAmount] =
    useState(0);
  const [weeklySummary, setWeeklySummary] = useState("");
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const transactions = await fetchTransactions();
        const computed = computeWeeklyFromTransactions(transactions);
        if (cancelled) return;
        setDays(computed.days);
        setTotalIncome(computed.totalIncome);
        setTotalExpense(computed.totalExpense);
        setNetBalance(computed.netBalance);
        setHighestExpenseDay(computed.highestExpenseDay);
        setLowestExpenseDay(computed.lowestExpenseDay);
        setHighestExpenseCategory(computed.highestExpenseCategory);
        setHighestExpenseCategoryAmount(computed.highestExpenseCategoryAmount);
        setLowestExpenseCategory(computed.lowestExpenseCategory);
        setLowestExpenseCategoryAmount(computed.lowestExpenseCategoryAmount);
        setWeeklySummary(computed.weeklySummary);
        setSuggestion(computed.suggestion);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const hasData = useMemo(() => {
    return safeNumber(totalIncome) > 0 || safeNumber(totalExpense) > 0;
  }, [totalIncome, totalExpense]);

  return {
    loading,
    days,
    totalIncome,
    totalExpense,
    netBalance,
    weeklySummary,
    highestExpenseDay,
    lowestExpenseDay,
    highestExpenseCategory,
    highestExpenseCategoryAmount,
    lowestExpenseCategory,
    lowestExpenseCategoryAmount,
    suggestion,
    hasData,
  };
}
