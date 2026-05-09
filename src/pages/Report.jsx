import React, { useMemo, useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import UserNavbar from "../components/Dashboard/UserNavbar";
import MonthlyActivitySection from "../components/Report/MonthlyActivitySection.jsx";
import QuickStatsSection from "../components/Report/QuickStatsSection.jsx";
import MonthlySummaryCard from "../components/Report/MonthlySummaryCard.jsx";
import InsightsCard from "../components/Report/InsightsCard.jsx";
import { useReportData } from "../components/Report/useReportData.js";
import WeeklyActivitySection from "../components/Report/WeeklyActivitySection.jsx";
import WeeklySummaryCard from "../components/Report/WeeklySummaryCard.jsx";
import WeeklyInsightsCard from "../components/Report/WeeklyInsightsCard.jsx";
import { useWeeklyReportData } from "../components/Report/useWeeklyReportData.js";
import { FileText } from "lucide-react";
import { getUserName } from "../constants/auth.js";

export default function Report() {
  const [range, setRange] = useState("weekly");
  const [monthKey, setMonthKey] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${mm}`;
  });

  const { loading, totalIncome, netBalance, computed, hasData } = useReportData(
    {
      monthKey,
      enabled: range === "monthly",
    },
  );

  const weekly = useWeeklyReportData({ enabled: range === "weekly" });

  // const userName = getUserName() || "User";

  // const handleDownload = async () => {
  //   try {
  //     const response = await axios.get("/downloadReport/download", {
  //       responseType: "blob",
  //       withCredentials: true,
  //     });
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `Expense-Report-${Date.now()}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     toast("Report downloaded successfully!", { type: "success", autoClose: 2000 });
  //   } catch (error) {
  //     toast("Failed to download report. Please try again.", { type: "error", autoClose: 2000 });
  //   }
  // };

  const topRow = useMemo(() => {
    if (range === "weekly") {
      return (
        <>
          <WeeklyActivitySection loading={weekly.loading} segments={weekly.segments} />
          <QuickStatsSection
            totalIncome={weekly.totalIncome}
            totalExpense={weekly.totalExpense}
            netBalance={weekly.netBalance}
          />
        </>
      );
    }

    return (
      <>
        <MonthlyActivitySection
          loading={loading}
          segments={computed.segments}
        />
        <QuickStatsSection
          totalIncome={totalIncome}
          totalExpense={computed.totalExp}
          netBalance={netBalance}
        />
      </>
    );
  }, [
    range,
    weekly,
    loading,
    computed.segments,
    totalIncome,
    netBalance,
    computed.totalExp,
  ]);

  const summarySection = useMemo(() => {
    if (range === "weekly") {
      return (
        <WeeklySummaryCard
          loading={weekly.loading}
          hasData={weekly.hasData}
          text={weekly.weeklySummary}
        />
      );
    }

    return (
      <MonthlySummaryCard
        loading={loading}
        hasData={hasData}
        text={computed.monthlySummary}
      />
    );
  }, [range, weekly, loading, hasData, computed.monthlySummary]);

  const insightsSection = useMemo(() => {
    if (range === "weekly") {
      return (
        <WeeklyInsightsCard
          loading={weekly.loading}
          hasData={weekly.hasData}
          highestCategory={weekly.highestExpenseCategory}
          highestAmount={weekly.highestExpenseCategoryAmount}
          lowestCategory={weekly.lowestExpenseCategory}
          lowestAmount={weekly.lowestExpenseCategoryAmount}
          suggestion={weekly.suggestion}
        />
      );
    }

    return (
      <InsightsCard
        hasData={hasData}
        highestCategory={computed.top?.category}
        lowestCategory={computed.bottom?.category}
        suggestion={computed.suggestion}
        opportunity={computed.opportunity}
      />
    );
  }, [range, weekly, hasData, computed.top, computed.bottom, computed.suggestion, computed.opportunity]);

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#dce7d7] text-gray-800 font-sans flex flex-col overflow-hidden">
      <UserNavbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main
          className="flex-1 bg-transparent relative overflow-y-a
          uto pb-14 pt-16"
          style={{ marginLeft: "var(--sidebar-width, 256px)" }}
        >
          <div className="p-10 max-w-[1180px]">
            {/* Greeting Banner */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText size={24} color="#fff" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1a2b20]">
                    Report
                  </h1>
                  <p className="text-sm text-gray-600">Detailed insights into your financial activities.</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-gray-700 bg-white/70 border border-white/40 rounded-lg px-4 py-2">
                  {todayStr}
                </span>
                {/* <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md"
                >
                  <Download size={16} />
                  Download PDF
                </button> */}
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-[220px] rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1a2b20] focus:outline-none focus:ring-2 focus:ring-[#2f5c2b]/30"
                aria-label="Report range"
              >
                <option value="monthly">Monthly Data</option>
                <option value="weekly">Weekly Data</option>
              </select>

              {range === "monthly" && (
                <input
                  type="month"
                  value={monthKey}
                  onChange={(e) => setMonthKey(e.target.value)}
                  className="w-[220px] rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1a2b20] focus:outline-none focus:ring-2 focus:ring-[#2f5c2b]/30"
                  aria-label="Report month"
                />
              )}
            </div>

            {range === "weekly" ? (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_0.95fr] items-stretch gap-8">
                <div className="h-full">
                  <WeeklyActivitySection loading={weekly.loading} segments={weekly.segments} />
                </div>

                <div className="grid gap-6 h-full">
                  <QuickStatsSection
                    totalIncome={weekly.totalIncome}
                    totalExpense={weekly.totalExpense}
                    netBalance={weekly.netBalance}
                  />
                  <WeeklySummaryCard
                    loading={weekly.loading}
                    hasData={weekly.hasData}
                    text={weekly.weeklySummary}
                  />
                  <WeeklyInsightsCard
                    loading={weekly.loading}
                    hasData={weekly.hasData}
                    highestCategory={weekly.highestExpenseCategory}
                    highestAmount={weekly.highestExpenseCategoryAmount}
                    lowestCategory={weekly.lowestExpenseCategory}
                    lowestAmount={weekly.lowestExpenseCategoryAmount}
                    suggestion={weekly.suggestion}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_0.95fr] items-stretch gap-8">
                <div className="h-full">
                  <MonthlyActivitySection
                    loading={loading}
                    segments={computed.segments}
                  />
                </div>

                <div className="grid gap-6 h-full">
                  <QuickStatsSection
                    totalIncome={totalIncome}
                    totalExpense={computed.totalExp}
                    netBalance={netBalance}
                  />
                  <MonthlySummaryCard
                    loading={loading}
                    hasData={hasData}
                    text={computed.monthlySummary}
                  />
                  <InsightsCard
                    hasData={hasData}
                    highestCategory={computed.top?.category}
                    lowestCategory={computed.bottom?.category}
                    suggestion={computed.suggestion}
                    opportunity={computed.opportunity}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
