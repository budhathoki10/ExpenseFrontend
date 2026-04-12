import React from "react";
import { User } from "lucide-react";
import spendIcon from "../../assets/spendWise.png";

export default function UserNavbar({ title = "Spend Wise" }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#dce7d7] h-16 flex items-center px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-serif italic font-semibold text-[#083b22]">
          {title}
        </h1>
        <img
          src={spendIcon}
          alt="Spend Wise"
          className="w-7 h-7 object-contain"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#083b22]">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
