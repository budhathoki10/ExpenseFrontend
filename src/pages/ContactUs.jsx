import React from "react";

const cards = [
  {
    title: "Drop us a note",
    body: "hello@spendwise.app",
    hint: "We answer within one business day.",
  },
  {
    title: "Ping us on chat",
    body: "In-app chat 9am–6pm, Mon–Fri",
    hint: "Powered by real humans.",
  },
];

export default function ContactUs() {
  return (
    <section className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 py-16">
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
            Prefer voice? Call +977-9800-SPENDW (10am–4pm, Sun–Thu)
          </p>
          <a
            href="mailto:hello@spendwise.app"
            className="px-5 py-2 rounded-full bg-[#5d8d5a] text-white text-sm font-semibold hover:bg-[#4d784a] transition-colors"
          >
            Send quick email
          </a>
        </div>
      </div>
    </section>
  );
}
