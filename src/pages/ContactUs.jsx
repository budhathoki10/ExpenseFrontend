import React, { useState } from "react";
import landing from "../assets/landingImange.png";
import axios from "../constants/api.js";
import { toast } from "react-toastify";

const cards = [
  {
    title: "Drop us a note",
    body: "Spend Wise Team",
    hint: "We answer within one business day.",
  },
  {
    title: "Ping us on chat",
    body: "Every time you open the app",
    hint: "Powered by real humans.",
  },
];

export default function ContactUs() {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }
    setSending(true);
    try {
      console.log("helloooooooooo")
      // API expects authentication; include credentials. Adjust endpoint if needed.
      await axios.post(
        "/sendMessage",
        { userName, email, message },
        { withCredentials: true },
      );

      toast.success("Message sent. We'll get back to you soon.", { autoClose: 1500 });
      setName("");
      setEmail("");
      setDescription("");
    } catch (err) {
      console.error("Failed to send contact message:", err);
      toast.error("Failed to send message. Please try again.", { autoClose: 1500 });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="min-h-screen text-white flex items-center justify-center px-6 py-16"
      style={{
        backgroundImage: `url(${landing})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-3xl w-full bg-[#1c1c1c] border border-[#2b2b2b] rounded-[32px] p-10 space-y-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-[#6ea16a] mb-3">
            SAY HELLO
          </p>
          <h1 className="text-4xl font-serif text-[#d1f5ce] mb-3">
            We keep replies short, sweet, and useful.
          </h1>
          <p className="text-gray-300 text-base">
            Whether you spotted a bug or just landed your first zero-spend week,
            we want to hear it.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-[#232323] rounded-2xl border border-[#2f2f2f] p-6"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">
                {card.title}
              </p>
              <p className="text-xl font-semibold text-white">{card.body}</p>
              <p className="text-xs text-gray-500 mt-3">{card.hint}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#2b2b2b] rounded-2xl px-5 py-4">
          <p className="text-gray-300 text-sm">
            Prefer voice? Call 9812345678 (10am–4pm, Sun–Fri)
          </p>
          <a
            href="mailto:hello@spendwise.app"
            className="px-5 py-2 rounded-full bg-[#5d8d5a] text-white text-sm font-semibold hover:bg-[#4d784a] transition-colors"
          >
            Send quick email
          </a>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Name</label>
            <input
              value={userName}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#0f0f0f] border border-[#2b2b2b] text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#0f0f0f] border border-[#2b2b2b] text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded bg-[#0f0f0f] border border-[#2b2b2b] text-white"
              placeholder="How can we help?"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2 rounded bg-[#5d8d5a] hover:bg-[#4d784a] text-white font-semibold"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
