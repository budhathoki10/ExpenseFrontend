import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../constants/api.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { clearAuth } from "../constants/auth.js";
import Sidebar from "../components/Dashboard/Sidebar";
import UserNavbar from "../components/Dashboard/UserNavbar";

const priorities = ["low", "medium", "high"];
const timeframes = ["weekly", "monthly", "yearly"];

function ProgressBar({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
      <div
        className="h-4 rounded-full transition-all duration-500"
        style={{ width: `${percent}%`, background: percent === 100 ? '#16a34a' : '#3b82f6' }}
      ></div>
    </div>
  );
}

function Fireworks({ show }) {
  // Placeholder for fireworks animation (use a library or custom SVG for production)
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <span className="text-6xl animate-bounce">🎆🎇</span>
    </div>
  );
}

export default function SetGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    goalName: "",
    targetAmount: "",
    savedAmount: "",
    timeframe: "monthly",
    priority: "medium",
    deadline: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Fetch goals
  useEffect(() => {
    axios.get("/goals", { withCredentials: true })
      .then(res => setGoals(res.data.data || res.data))
      .catch(() => setGoals([]));
  }, []);

  // Fireworks effect
  useEffect(() => {
    if (showFireworks) {
      const t = setTimeout(() => setShowFireworks(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showFireworks]);

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...form, targetAmount: Number(form.targetAmount), savedAmount: Number(form.savedAmount) };
    try {
      if (editingId) {
        await axios.put(`/goals/${editingId}`, payload, { withCredentials: true });
        toast.success("Goal updated!");
      } else {
        await axios.post("/save-goal", payload, { withCredentials: true });
        toast.success("Goal added!");
      }
      setForm({ goalName: "", targetAmount: "", savedAmount: "", timeframe: "monthly", priority: "medium", deadline: "" });
      setEditingId(null);
      // Refresh goals
      const res = await axios.get("/goals", { withCredentials: true });
      setGoals(res.data.data || res.data);
    } catch {
      toast.error("Failed to save goal");
    }
  };

  const handleEdit = g => {
    setForm({
      goalName: g.goalName,
      targetAmount: g.targetAmount,
      savedAmount: g.savedAmount,
      timeframe: g.timeframe,
      priority: g.priority,
      deadline: g.deadline ? g.deadline.slice(0, 10) : "",
    });
    setEditingId(g._id);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await axios.delete(`/goals/${id}`, { withCredentials: true });
      setGoals(goals => goals.filter(g => g._id !== id));
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  const handleAddSaving = async (id, addAmount) => {
    try {
      await axios.post(`/goals/${id}/add-saving`, { amount: Number(addAmount) }, { withCredentials: true });
      const res = await axios.get("/goals", { withCredentials: true });
      setGoals(res.data.data || res.data);
      toast.success("Saved amount updated");
    } catch {
      toast.error("Failed to add saving");
    }
  };

  // Show fireworks if any goal is completed
  useEffect(() => {
    if (goals.some(g => Number(g.savedAmount) >= Number(g.targetAmount))) {
      setShowFireworks(true);
    }
  }, [goals]);

  return (
    <div className="min-h-screen bg-[#dce7d7] text-gray-800 font-sans flex flex-col overflow-hidden">
      <UserNavbar />
      <Fireworks show={showFireworks} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-white relative overflow-y-auto pb-20 pt-16" style={{ marginLeft: "var(--sidebar-width, 256px)" }}>
          <div className="p-10 max-w-[1100px] mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Set Goals</h1>
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl shadow p-6 mb-10 flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block mb-1 font-semibold">Goal Name</label>
                <input name="goalName" value={form.goalName} onChange={handleInput} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block mb-1 font-semibold">Target Amount</label>
                <input name="targetAmount" type="number" value={form.targetAmount} onChange={handleInput} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block mb-1 font-semibold">Saved Amount</label>
                <input name="savedAmount" type="number" value={form.savedAmount} onChange={handleInput} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block mb-1 font-semibold">Deadline</label>
                <input name="deadline" type="date" value={form.deadline} onChange={handleInput} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block mb-1 font-semibold">Priority</label>
                <select name="priority" value={form.priority} onChange={handleInput} className="w-full border px-3 py-2 rounded">
                  {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block mb-1 font-semibold">Timeframe</label>
                <select name="timeframe" value={form.timeframe} onChange={handleInput} className="w-full border px-3 py-2 rounded">
                  {timeframes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow">
                {editingId ? "Update Goal" : "Add Goal"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ goalName: "", targetAmount: "", savedAmount: "", timeframe: "monthly", priority: "medium", deadline: "" }); }} className="ml-2 text-gray-600 underline">Cancel</button>
              )}
            </form>

            <div className="space-y-6">
              {goals.length === 0 && <div className="text-gray-500">No goals yet. Add your first goal!</div>}
              {goals.map(goal => {
                const completed = Number(goal.savedAmount) >= Number(goal.targetAmount);
                return (
                  <div key={goal._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-6 border border-gray-100 relative">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 items-center mb-2">
                        <span className="text-lg font-bold text-gray-800">{goal.goalName}</span>
                        <span className={`text-xs px-2 py-1 rounded ${goal.priority === 'high' ? 'bg-red-100 text-red-700' : goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{goal.priority}</span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{goal.timeframe}</span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">Deadline: {goal.deadline ? goal.deadline.slice(0, 10) : '-'}</span>
                      </div>
                      <div className="mb-2 text-sm text-gray-600">Target: <b>Rs. {goal.targetAmount}</b> | Saved: <b>Rs. {goal.savedAmount}</b></div>
                      <ProgressBar value={goal.savedAmount} max={goal.targetAmount} />
                      {completed && <span className="text-green-700 font-semibold">🎉 Goal Completed!</span>}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px] items-end">
                      <button onClick={() => handleEdit(goal)} className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">Edit</button>
                      <button onClick={() => handleDelete(goal._id)} className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
                      <form onSubmit={e => { e.preventDefault(); const amt = e.target.amount.value; if (!amt) return; handleAddSaving(goal._id, amt); e.target.reset(); }} className="flex gap-2 mt-2">
                        <input name="amount" type="number" min="1" placeholder="Add Saving" className="border px-2 py-1 rounded w-24" />
                        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Add</button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
