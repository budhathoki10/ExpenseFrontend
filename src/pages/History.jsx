import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_STORAGE_KEY, getToken, clearAuth } from "../constants/auth.js";
import Sidebar from "../components/Dashboard/Sidebar";
import UserNavbar from "../components/Dashboard/UserNavbar";
import { Clock, ArrowUpRight, CreditCard } from "lucide-react";
import TransactionList from "../components/History/TransactionList";

export default function History() {
  const navigate = useNavigate();

  const [totalSpent, setTotalSpent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
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
        if (Array.isArray(res?.data)) {
          data = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          data = res.data.data;
        } else if (Array.isArray(res?.data?.expenses)) {
          data = res.data.expenses;
        } else if (Array.isArray(res?.data?.transactions)) {
          data = res.data.transactions;
        } else if (res?.data && typeof res.data === "object") {
          const arrayVal = Object.values(res.data).find((val) =>
            Array.isArray(val),
          );
          if (arrayVal) data = arrayVal;
        }

        let spent = 0;
        let received = 0;
        if (Array.isArray(data)) {
          data.forEach((it) => {
            const amt = Number(it.amount) || Number(it.total) || 0;
            const t = (it.type || it.transactionType || "").toLowerCase();

            // Usually, expenses are categorized as "expense", income as "income"
            if (t === "expense") {
              spent += amt;
            } else if (t === "income") {
              received += amt;
            } else {
              // fallback if it's not strictly 'expense' or 'income'
              received += amt;
            }
          });
        }
        setTotalSpent(spent);
        setTotalReceived(received);
        setNetBalance(received - spent);
      } catch (err) {
        console.error("Failed to fetch transactions for history:", err);
      }
    };
    fetchTransactions();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#dce7d7] text-gray-800 font-sans flex flex-col overflow-hidden">
      <UserNavbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-white relative overflow-y-auto pb-20 ml-64 pt-16">
          <div className="p-10 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">History</h1>
                <p className="mt-2 text-gray-600">
                  Track all your transaction in one place
                </p>
              </div>
            </div>

            <div className="mt-8 ml-0 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-green-100 rounded-lg shadow p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#16bd40] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#0f5132]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                  <div className="text-lg font-semibold">
                    Rs.{" "}
                    {totalSpent.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-green-100 rounded-lg shadow p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#16bd40] flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-[#0f5132]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Received</div>
                  <div className="text-lg font-semibold">
                    Rs.{" "}
                    {totalReceived.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-green-100 rounded-lg shadow p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#16bd40] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#0f5132]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Net Balance</div>
                  <div className="text-lg font-semibold">
                    Rs.{" "}
                    {netBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction list area */}
            <TransactionList />
          </div>
        </main>
      </div>
    </div>
  );
}
