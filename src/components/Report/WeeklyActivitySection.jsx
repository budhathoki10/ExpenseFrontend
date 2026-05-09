import React from "react";
import { arcPath, clamp, labelPoint, formatMoney, safeNumber } from "./reportUtils.js";

function PieWithLabels({ segments }) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const r = 170;

  const total =
    safeNumber(segments.reduce((sum, it) => sum + safeNumber(it.value), 0)) || 1;
  let currentAngle = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label="Weekly activity pie chart"
    >
      {segments.map((seg, idx) => {
        const value = safeNumber(seg.value);
        const sweep = clamp((value / total) * 360, 0, 360);
        const startAngle = currentAngle;
        const endAngle = currentAngle + sweep;
        currentAngle = endAngle;

        const midAngle = startAngle + sweep / 2;
        const labelPos = labelPoint(cx, cy, r * 0.6, midAngle);
        const pct = Math.round((value / total) * 100);

        return (
          <g key={`${seg.label}-${idx}`}>
            <path d={arcPath(cx, cy, r, startAngle, endAngle)} fill={seg.color} stroke="#fff" strokeWidth="1" />
            {pct > 0 ? (
              <text
                x={labelPos.x}
                y={labelPos.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="700"
                fill="#0b1f14"
              >
                {pct}%
              </text>
            ) : null}
            {pct > 0 ? (
              <text
                x={labelPos.x}
                y={labelPos.y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="600"
                fill="#0b1f14"
              >
                {String(seg.label).slice(0, 14)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function SegmentLegend({ segments }) {
  return (
    <div className="mt-4 grid gap-2 w-full max-w-[400px]">
      {segments.map((seg, idx) => (
        <div key={`${seg.label}-legend-${idx}`} className="flex items-center justify-between rounded-2xl bg-[#f8faf9] px-3 py-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: seg.color }} />
            <span className="font-medium text-[#1a2b20]">{String(seg.label).slice(0, 20)}</span>
          </div>
          <span className="text-gray-600">Rs. {formatMoney(seg.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyActivitySection({ loading, segments }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a2b20]">Weekly Activity</h2>
      <div
        className="mt-3 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center">
          {loading ? (
            <div className="h-[320px] w-[320px] flex items-center justify-center text-sm text-gray-500">
              Loading...
            </div>
          ) : segments && segments.length > 0 ? (
            <>
              <PieWithLabels segments={segments} />
              <p className="mt-4 text-xs text-gray-500">Expense-only category split.</p>
              <SegmentLegend segments={segments} />
            </>
          ) : (
            <div className="h-[360px] w-[360px] flex items-center justify-center text-sm text-gray-500">
              No weekly category data yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
