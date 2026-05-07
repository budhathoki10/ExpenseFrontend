import React from "react";
import { arcPath, clamp, labelPoint, safeNumber } from "./reportUtils.js";

function PieWithLabels({ segments }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;

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
            />
            {pct > 0 ? (
              <text
                x={labelPos.x}
                y={labelPos.y - 2}
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

export default function MonthlyActivitySection({ loading, segments }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a2b20]">Monthly Activity</h2>
      <div
        className="mt-3 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <div className="bg-white rounded-2xl p-4" style={{ maxWidth: 520 }}>
          <div className="flex items-center justify-center">
            {loading ? (
              <div className="h-[260px] w-[260px] flex items-center justify-center text-sm text-gray-500">
                Loading...
              </div>
            ) : segments && segments.length > 0 ? (
              <PieWithLabels segments={segments} />
            ) : (
              <div className="h-[260px] w-[260px] flex items-center justify-center text-sm text-gray-500">
                No monthly activity yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
