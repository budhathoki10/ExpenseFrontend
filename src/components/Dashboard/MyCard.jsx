import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function MyCard({
  balance = "4,970",
  cardHolder = "Suichha Chand",
  cardNumber = "08923*******1267",
}) {
  const [visible, setVisible] = useState(false); // default hidden

  const toggleVisible = () => setVisible((v) => !v);
  return (
    <div className="flex-[1.1]">
      <h2 className="text-xl font-medium mb-6 text-[#063b20]">My card</h2>
      <div
        className="text-white rounded-[20px] p-8 w-full max-w-[540px] h-[300px] shadow-[0_20px_50px_rgba(20,60,30,0.18)] transition-transform duration-200 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(10,40,20,0.22)] flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg,#21c049,#436f49)",
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-2xl opacity-90 mb-1 flex items-center gap-2">
              Balance :
            </p>
            <div className="flex items-center gap-3">
              <p className="text-2xl tracking-wide">
                Rs. {visible ? balance : "xxxxxx"}
              </p>
              <button
                type="button"
                onClick={toggleVisible}
                aria-label={visible ? "Hide balance" : "Show balance"}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20"
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {/* Chip icon */}
          <div className="w-12 h-9 rounded border border-white/30 flex items-center justify-center opacity-90">
            <div className="w-7 h-5 border border-white/30 rounded-sm"></div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl opacity-90 mb-1">Name :</p>
          <p className="text-4xl tracking-wide">{cardHolder}</p>
        </div>

        <div className="flex justify-between items-end mt-2">
          <p className=" tracking-widest font-mono text-lg">{cardNumber}</p>
          {/* Mastercard style circles */}
          <div className="flex -space-x-3 opacity-90">
            <div className="w-8 h-8 rounded-full border-2 border-white/60"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white/60 bg-transparent flex items-center backdrop-blur-sm justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
