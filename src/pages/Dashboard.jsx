import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AUTH_STORAGE_KEY,
  getToken,
  getUserName,
  clearAuth,
} from "../constants/auth.js";
import WeeklyActivity from "../components/Dashboard/WeeklyActivity";
import ExpenseStatistics from "../components/Dashboard/ExpenseStatistics";
import MyCard from "../components/Dashboard/MyCard";
import Sidebar from "../components/Dashboard/Sidebar";
import UserNavbar from "../components/Dashboard/UserNavbar";
import {
  LogOut,
  MessageCircle,
  ChevronDown,
  Hand,
  Wallet,
  Home,
  CreditCard,
  Target,
  Clock,
  BarChart,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenseStats, setExpenseStats] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [userName, setUserName] = useState("User");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchExpenseStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ExpenseMoney", {
          withCredentials: true,
        });

        const rawData = res.data.expenses || res.data;

        if (Array.isArray(rawData)) {
          const aggregated = rawData.reduce((acc, curr) => {
            const cat = curr.category || "Other";
            const amt = Number(curr.amount) || Number(curr.total) || 0;
            acc[cat] = (acc[cat] || 0) + amt;
            return acc;
          }, {});

          const statsArray = Object.entries(aggregated).map(
            ([category, amount]) => ({
              category,
              amount,
            }),
          );

          const total = statsArray.reduce((sum, item) => sum + item.amount, 0);
          statsArray.sort((a, b) => b.amount - a.amount);

          setExpenseStats(statsArray);
          setTotalExpense(total);
        }
      } catch (error) {
        console.error("Failed to fetch expense statistics:", error);
      }
    };

    fetchExpenseStats();
    // fetch wallet balance for current user
    const fetchWallet = async () => {
      try {
        const token = getToken();
        const config = { withCredentials: true, headers: {} };
        if (token) config.headers.Authorization = `Bearer ${token}`;
        const res = await axios.post(
          "https://expenses-tracker-backend-ki3x.onrender.com/api/viewExpenses",
          {},
          config,
        );

        let data = [];
        if (Array.isArray(res?.data)) data = res.data;
        else if (Array.isArray(res?.data?.data)) data = res.data.data;
        else if (Array.isArray(res?.data?.expenses)) data = res.data.expenses;
        else if (Array.isArray(res?.data?.transactions))
          data = res.data.transactions;
        else if (res?.data && typeof res.data === "object") {
          const arrayVal = Object.values(res.data).find((v) =>
            Array.isArray(v),
          );
          if (arrayVal) data = arrayVal;
        }

        let bal = 0;
        const norm = (Array.isArray(data) ? data : []).map((it) => ({
          date: it.Date || it.date || it.createdAt || "",
          category: it.category || it.categoryName || "",
          type: it.type || it.transactionType || "",
          amount: Number(it.amount) || Number(it.total) || 0,
          raw: it,
        }));

        if (Array.isArray(norm)) {
          norm.forEach((it) => {
            const amt = Number(it.amount) || 0;
            const t = (it.type || "").toLowerCase();
            if (t === "expense") bal -= amt;
            else bal += amt;
          });
        }
        // keep recent transactions for display
        setTransactions(norm);
        setWalletBalance(
          bal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        );

        // decode name from token if present (prefer username over email)
        try {
          if (token) {
            const parts = token.split(".");
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1]));
              const rawName =
                payload.name || payload.userName || payload.email || null;
              if (rawName) {
                const username =
                  typeof rawName === "string" && rawName.includes("@")
                    ? rawName.split("@")[0]
                    : rawName;
                setUserName(username);
              }
            }
          }
        } catch (e) {
          // ignore
        }
      } catch (err) {
        console.error("Failed to fetch wallet for dashboard:", err);
      }
    };
    // prefer stored display name from login if present
    const storedName = getUserName();
    if (storedName) setUserName(storedName);
    fetchWallet();
  }, []);

  const pieColors = [
    "#16a34a",
    "#eab308",
    "#3b82f6",
    "#ef4444",
    "#a855f7",
    "#ec4899",
    "#f97316",
  ];
  let currentPercentage = 0;
  const gradientStops = expenseStats
    .map((stat, idx) => {
      const start = currentPercentage;
      const percentage = (stat.amount / (totalExpense || 1)) * 100;
      const end = currentPercentage + percentage;
      currentPercentage = end;
      return `${pieColors[idx % pieColors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  const pieBackground =
    expenseStats.length > 0 && totalExpense > 0
      ? `conic-gradient(${gradientStops})`
      : "conic-gradient(#e5e7eb 0% 100%)";

  let accum = 0;
  const pieSize = 240;
  const labelRadius = Math.round(pieSize * 0.28);
  const rotationOffset = (-45 * Math.PI) / 180;

  const slices = expenseStats.map((stat, idx) => {
    const percentage = (stat.amount / (totalExpense || 1)) * 100;
    const midPoint = accum + percentage / 2;
    accum += percentage;

    const angle = (midPoint / 100) * 2 * Math.PI - Math.PI / 2 + rotationOffset;
    const x = Math.cos(angle) * labelRadius;
    const y = Math.sin(angle) * labelRadius;

    return {
      ...stat,
      percentage,
      x,
      y,
      color: pieColors[idx % pieColors.length],
    };
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true },
      );
      toast("You have logged out successfully", {
        type: "success",
        autoClose: 1500,
      });
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  function formatDateLocal(d) {
    try {
      if (!d) return "";
      const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
      let dt;
      if (typeof d === "string" && isoDateOnly.test(d)) {
        const [y, m, day] = d.split("-").map((n) => parseInt(n, 10));
        dt = new Date(y, m - 1, day);
      } else {
        dt = new Date(d);
      }
      return dt.toLocaleDateString();
    } catch (e) {
      return d;
    }
  }

  return (
    <div
      className="min-h-screen text-gray-900 font-sans flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #cfead9 0%, #b6d8c1 25%, #7fb871 60%, #3e8b3f 100%)",
      }}
    >
      <UserNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 bg-white relative overflow-y-auto pb-20 ml-64 pt-16">
          <div className="p-10 w-full max-w-full">
            {/* Top Row: Cards & Transactions */}
            <div className="flex flex-col xl:flex-row gap-12 mb-12">
              <MyCard
                balance={walletBalance}
                cardHolder={userName}
                cardNumber="08923*******1267"
              />

              {/* Recent Transactions Section */}
              <div className="flex-[1.3]">
                <h2 className="text-2xl font-medium mb-6">
                  Recent Transaction
                </h2>
                <div className="bg-[linear-gradient(135deg,#39dd62,#436f49)] p-8 rounded-lg shadow-[0_20px_50px_rgba(20,60,30,0.18)] w-full max-w-2xl overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Recent Transaction
                    </h3>
                    <Link
                      to="/history"
                      className="text-sm font-medium text-white hover:text-white/80"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((item, index) => {
                      const isExpense =
                        String(item.type || "").toLowerCase() === "expense";
                      return (
                        <div
                          key={index}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex items-center justify-between transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:bg-white/20"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/20 rounded-full">
                              <Wallet size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {item.category}
                              </p>
                              <p className="text-sm text-white/80">
                                {formatDateLocal(item.date)}
                              </p>
                            </div>
                          </div>
                          <p
                            className={`font-semibold ${isExpense ? "text-red-300" : "text-green-300"}`}
                          >
                            {isExpense ? "-" : "+"}
                            {Number(item.amount).toLocaleString(undefined, {
                              style: "currency",
                              currency: "USD",
                            })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Charts */}
            <div className="flex flex-col xl:flex-row gap-12">
              <WeeklyActivity transactions={transactions} />
              <ExpenseStatistics
                expenseStats={expenseStats}
                totalExpense={totalExpense}
                pieBackground={pieBackground}
                slices={slices}
                transactions={transactions}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 pr-4 z-50">
        <div className="flex items-center gap-2 bg-transparent text-sm font-medium text-gray-800 pointer-events-none">
          <Hand className="w-4 h-4" /> We are here!
        </div>
        <button className="bg-white p-4 rounded-full shadow-lg border-2 border-black/80 hover:bg-gray-50 transition-colors">
          <MessageCircle className="w-8 h-8 text-black" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
