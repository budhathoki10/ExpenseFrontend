import axios from "../../constants/api.js";
import { safeNumber } from "./reportUtils.js";

export async function fetchMonthlySummary() {
  const res = await axios.get("/monthlySummary", { withCredentials: true });
  const payload = res?.data?.data || res?.data || {};
  return {
    totalIncome: safeNumber(payload?.totalIncome),
    totalExpense: safeNumber(payload?.totalExpense),
    netBalance: safeNumber(payload?.walletBalance),
  };
}

export async function fetchMonthlyExpenseByCategory() {
  const res = await axios.get("/filterPieChart?filter=monthly", {
    withCredentials: true,
  });
  const payload = res?.data?.data || res?.data || {};
  const agg =
    payload?.AggregationResult ||
    payload?.Aggregation ||
    payload?.aggregation ||
    [];
  const arr = Array.isArray(agg)
    ? agg
        .map((it) => ({
          category: it._id || it.category || it.categoryName || "Other",
          amount: safeNumber(it.total || it.amount || 0),
        }))
        .filter((it) => it.amount > 0)
    : [];
  const totalExpense =
    safeNumber(payload?.totalExpense) ||
    arr.reduce((s, it) => s + safeNumber(it.amount), 0);

  return { expenseByCategory: arr, totalExpense };
}

export async function fetchTransactions() {
  const res = await axios.post("/viewExpenses", {}, { withCredentials: true });
  let data = [];
  if (Array.isArray(res?.data)) data = res.data;
  else if (Array.isArray(res?.data?.data)) data = res.data.data;
  else if (Array.isArray(res?.data?.expenses)) data = res.data.expenses;
  else if (Array.isArray(res?.data?.transactions)) data = res.data.transactions;
  else if (res?.data && typeof res.data === "object") {
    const v = Object.values(res.data).find(Array.isArray);
    if (v) data = v;
  }
  return data || [];
}
