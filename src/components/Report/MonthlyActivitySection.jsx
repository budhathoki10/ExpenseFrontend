import React from "react";
import {
  arcPath,
  clamp,
  labelPoint,
  formatMoney,
  safeNumber,
} from "./reportUtils.js";

function PieWithLabels({ segments }) {
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const r = 160;

  const total =
    safeNumber(segments.reduce((s, it) => s + safeNumber(it.value), 0)) || 1;
  let currentAngle = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Monthly activity pie chart"
    >
      {segments.map((seg, idx) => {
        const value = safeNumber(seg.value);
        const sweep = clamp((value / total) * 360, 0, 360);
        const startAngle = currentAngle;
        const endAngle = currentAngle + sweep;
        currentAngle = endAngle;

        const midAngle = startAngle + sweep / 2;
        const labelPos = labelPoint(cx, cy, r * 0.58, midAngle);
        const pct = Math.round((value / total) * 100);

        return (
          <g key={`${seg.label}-${idx}`}>
            <path
              d={arcPath(cx, cy, r, startAngle, endAngle)}
              fill={seg.color}
              stroke="#fff"
              strokeWidth="3"
            />
            {pct > 0 && (
              <>
                <text
                  x={labelPos.x}
                  y={labelPos.y - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#fff"
                >
                  {pct}%
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#fff"
                >
                  {String(seg.label).slice(0, 14)}
                </text>
              </>
            )}
          </g>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="2"
      />
    </svg>
  );
}

function SegmentLegend({ segments }) {
  return (
    <div className="mt-5 grid gap-2 w-full">
      {segments.map((seg, idx) => (
        <div
          key={`${seg.label}-legend-${idx}`}
          className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ background: seg.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {String(seg.label).slice(0, 20)}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            Rs. {formatMoney(seg.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyActivitySection({ loading, segments }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-base font-semibold text-[#1a3328] mb-5">
        Monthly Activity
      </h2>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="h-[280px] flex items-center justify-center">
              <div className="w-7 h-7 border-4 border-[#2d6a3f] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : segments && segments.length > 0 ? (
            <PieWithLabels segments={segments} />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-sm text-gray-400">
              No monthly activity yet.
            </div>
          )}
        </div>
        {!loading && segments && segments.length > 0 && (
          <>
            <p className="mt-2 text-xs text-gray-400">
              Expense-only category split
            </p>
            <SegmentLegend segments={segments} />
          </>
        )}
      </div>
    </section>
  );
}
