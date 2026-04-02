import React from "react";
import landing from "../assets/landingImange.png";

export default function Home() {
  return (
    <div
      className="h-screen w-full flex  justify-center relative  overflow-hidden"
      style={{
        backgroundColor: "#111111",
        backgroundImage: `url(${landing})`,
        backgroundSize: "100% 120%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto w-full px-6 flex flex-col  items-center pt-[8%] text-center z-10">
        <h2 className="text-[44px] md:text-[56px] lg:text-[74px] font-serif tracking-wide text-white leading-[1.2]">
          Elevate Your
          <br />
          Financial Clarity
        </h2>
        <p className="mt-6 text-[#f5f1f1] max-w-[480px] mx-auto text-[16px] md:text-[18px] leading-[1.6]">
          Visualize your expenses and make confident
          <br className="hidden md:block" /> decisions with real-time insights.
        </p>
      </div>

      {/* Spending Insights Floating Box */}
      <div className="absolute bottom-[20%] left-[10%] md:left-[15%] lg:left-[25%] bg-[#82a56c] p-5 rounded-2xl shadow-lg z-20 flex flex-col gap-1.5 w-[240px] transition-all duration-300 hover:scale-105 hover:bg-[#8eb477] hover:shadow-2xl cursor-pointer group">
        {/* Tooltip on Hover - Cloud Shape at Top Left */}
        <div className="absolute bottom-[90%] right-[30%] w-[400px] h-[300px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform group-hover:-translate-x-2 group-hover:-translate-y-2 z-30 pointer-events-none drop-shadow-2xl">
          {/* Cloud SVG Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 130 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Wider and rounder cloud path with a tail */}
            <path
              d="M 40 85 Q 15 85 15 60 Q 10 40 30 35 Q 35 10 65 15 Q 95 10 100 35 Q 120 35 120 55 Q 120 80 95 85 L 125 110 L 80 85 Q 60 90 40 85 Z"
              fill="#a09b9b86"
            />
          </svg>

          {/* Cloud Content mathematically confined absolutely in the center safe zone */}
          <div className="absolute top-[22%] left-[18%] w-[64%] h-[48%] flex items-center justify-center">
            <p className="relative z-10 font-sans text-center text-[#f5f1f1] text-[15px] leading-[1.6]">
              Spend Wise effortlessly tracks your daily expenses, categorizes
              spending, and helps you achieve your ultimate financial goals.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <span className="font-serif text-[#111111] text-[17px] leading-tight">
            Spending Insights
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#111111] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 9-6 6" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 9h4.5v4.5"
            />
          </svg>
        </div>
        <span className="font-serif text-[#111111] text-[14px] leading-tight opacity-90">
          Understand Your
          <br />
          Habits
        </span>
      </div>
    </div>
  );
}
