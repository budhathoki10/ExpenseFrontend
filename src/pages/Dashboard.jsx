import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_STORAGE_KEY } from "../constants/auth.js";

export default function Dashboard() {
  const navigate = useNavigate();

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
    } catch (error) {
      console.error("Logout failed", error);
      toast("Logged out locally", { type: "info", autoClose: 1500 });
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f3f3] text-white flex flex-col items-center py-20 px-4 relative">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
      >
        Logout
      </button>
      <div className="max-w-4xl w-full bg-[#1c1c1c] p-10 rounded-2xl shadow-xl border border-gray-800">
        <h1 className="text-4xl font-bold text-[#2f5c2b] mb-6">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          You have successfully logged in. This is your central hub for tracking
          expenses, managing budgets, and staying on top of your financial
          goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-[#2f5c2b] transition-colors">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Total Balance
            </h3>
            <p className="text-3xl font-semibold text-white">$0.00</p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-[#2f5c2b] transition-colors">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Monthly Expenses
            </h3>
            <p className="text-3xl font-semibold text-red-400">$0.00</p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-[#2f5c2b] transition-colors">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Savings Goal
            </h3>
            <p className="text-3xl font-semibold text-[#5f8a5a]">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
