import { useEffect, useMemo, useState } from "react";
import {
  buildMonthlySummaryText,
  buildSuggestionAndOpportunity,
  safeNumber,
} from "./reportUtils.js";
import {
  fetchMonthlyExpenseByCategory,
  fetchMonthlySummary,
  fetchTransactions,
} from "./reportApi.js";

function currentMonthKey() {
  const now = new Date();
  return { m: now.getMonth(), y: now.getFullYear() };
}

function monthKeyString({ y, m }) {
  const mm = String(m + 1).padStart(2, "0");
  return `${y}-${mm}`;
}

function parseMonthKey(monthKey) {
  if (!monthKey) return currentMonthKey();

  if (typeof monthKey === "string") {
    const m = monthKey.match(/^(\d{4})-(\d{2})$/);
    if (m) {
      const y = Number(m[1]);
      const monthIndex = Number(m[2]) - 1;
      if (!Number.isNaN(y) && monthIndex >= 0 && monthIndex <= 11) {
        return { y, m: monthIndex };
      }
    }
  }

  // Fallback to current if input is unexpected
  return currentMonthKey();
}

function parseTxnDate(it) {
  const dateStr = it?.Date || it?.date || it?.createdAt || "";
  if (!dateStr) return null;

  // Date-only strings should be treated as local time
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const dt = new Date(`${dateStr}T00:00:00`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const dt = new Date(dateStr);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function computeFromTransactions(transactions, monthKey) {
  const { m, y } = parseMonthKey(monthKey);
  const byCat = {};
  let income = 0;
  let expense = 0;

  (transactions || []).forEach((it) => {
    const dt = parseTxnDate(it);
    if (!dt) return;
    if (dt.getMonth() !== m || dt.getFullYear() !== y) return;

    const type = String(it.type || it.transactionType || "").toLowerCase();
    const amt = safeNumber(it.amount || it.total || 0);
    if (type === "expense") {
      expense += amt;
      const cat = it.category || it.categoryName || "Other";
      byCat[cat] = safeNumber(byCat[cat]) + amt;
    } else if (type === "income") {
      income += amt;
    }
  });

  const expenseByCategory = Object.entries(byCat)
    .map(([category, amount]) => ({ category, amount }))
    .filter((it) => it.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense,
    expenseByCategory,
  };
}

export function useReportData({ monthKey, enabled = true } = {}) {
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [expenseByCategory, setExpenseByCategory] = useState([]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const run = async () => {
      setLoading(true);
      try {
        const selected = parseMonthKey(monthKey);
        const selectedKey = monthKeyString(selected);
        const nowKey = monthKeyString(currentMonthKey());
        const isCurrentMonth = selectedKey === nowKey;

        // If user selected a different month, compute from transactions so the filter is accurate.
        if (!isCurrentMonth) {
          const transactions = await fetchTransactions();
          const computed = computeFromTransactions(transactions, monthKey);
          if (!cancelled) {
            setTotalIncome(computed.totalIncome);
            setTotalExpense(computed.totalExpense);
            setNetBalance(computed.netBalance);
            setExpenseByCategory(computed.expenseByCategory);
          }
          return;
        }

        // Separate calls (as requested): summary + pie by category
        let summary = null;
        let pie = null;

        try {
          summary = await fetchMonthlySummary();
          if (!cancelled) {
            setTotalIncome(summary.totalIncome);
            setTotalExpense(summary.totalExpense);
            setNetBalance(summary.netBalance);
          }
        } catch {
          // ignore
        }

        try {
          pie = await fetchMonthlyExpenseByCategory();
          if (!cancelled) {
            setExpenseByCategory(pie.expenseByCategory);
            // If summary is missing or expense is zero, accept pie total.
            if (
              safeNumber(summary?.totalExpense) === 0 &&
              pie.totalExpense > 0
            ) {
              setTotalExpense(pie.totalExpense);
            }
          }
        } catch {
          // ignore
        }

        const needsFallback =
          safeNumber(summary?.totalIncome) === 0 &&
          safeNumber(summary?.totalExpense) === 0 &&
          safeNumber(summary?.netBalance) === 0 &&
          (pie?.expenseByCategory?.length || 0) === 0;

        if (needsFallback) {
          const transactions = await fetchTransactions();
          const fallback = computeFromTransactions(transactions, monthKey);
          if (!cancelled) {
            setTotalIncome(fallback.totalIncome);
            setTotalExpense(fallback.totalExpense);
            setNetBalance(fallback.netBalance);
            setExpenseByCategory(fallback.expenseByCategory);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [monthKey, enabled]);

  const computed = useMemo(() => {
    const byCat = (expenseByCategory || [])
      .slice()
      .sort((a, b) => b.amount - a.amount);
    const totalExp =
      safeNumber(totalExpense) ||
      byCat.reduce((s, it) => s + safeNumber(it.amount), 0);

    const top = byCat[0] || null;
    const bottom = byCat.length > 1 ? byCat[byCat.length - 1] : null;
    const topPct =
      top && totalExp > 0
        ? Math.round((safeNumber(top.amount) / totalExp) * 100)
        : 0;

    // Keep pie like the screenshot: top2 + Other
    const topTwo = byCat.slice(0, 2);
    const restTotal = byCat
      .slice(2)
      .reduce((s, it) => s + safeNumber(it.amount), 0);
    const segmentsRaw = [
      ...topTwo.map((it) => ({ label: it.category, value: it.amount })),
      ...(restTotal > 0 ? [{ label: "Other", value: restTotal }] : []),
    ];

    const palette = ["#3b82f6", "#16a34a", "#eab308"]; // blue, green, yellow
    const segments = segmentsRaw
      .filter((s) => safeNumber(s.value) > 0)
      .map((s, i) => ({ ...s, color: palette[i % palette.length] }));

    const { suggestion, opportunity } = buildSuggestionAndOpportunity({
      income: totalIncome,
      expense: totalExp,
    });

    const monthlySummary = buildMonthlySummaryText({
      income: totalIncome,
      expense: totalExp,
      balance: netBalance,
      topCategoryName: top?.category,
      topCategoryPct: topPct,
    });

    return {
      totalExp,
      top,
      bottom,
      topPct,
      segments,
      monthlySummary,
      suggestion,
      opportunity,
    };
  }, [expenseByCategory, totalExpense, totalIncome, netBalance]);

  const hasData = useMemo(() => {
    const inc = safeNumber(totalIncome);
    const exp = safeNumber(computed.totalExp);
    const hasCats = (expenseByCategory || []).length > 0;
    return inc > 0 || exp > 0 || hasCats;
  }, [totalIncome, computed.totalExp, expenseByCategory]);

  return {
    loading,
    totalIncome,
    totalExpense,
    netBalance,
    expenseByCategory,
    computed,
    hasData,
  };
}
