import React from "react";
import { safeNumber } from "./reportUtils.js";

function roundUp(n, step) {
  const v = safeNumber(n);
  if (v <= 0) return step;
  return Math.ceil(v / step) * step;
}

function WeeklyBarChart({ days }) {
  const width = 560;
  const height = 210;
  const padding = { top: 26, right: 22, bottom: 32, left: 34 };

  const maxVal = Math.max(
    0,
    ...(days || []).flatMap((d) => [
      safeNumber(d.income),
      safeNumber(d.expense),
    ]),
  );
  const yMax = Math.max(500, roundUp(maxVal, 100));

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const groupW = plotW / 7;
  const barW = Math.min(10, groupW * 0.26);
  const barGap = Math.min(6, groupW * 0.14);

  const y = (val) => {
    const v = safeNumber(val);
    const t = yMax === 0 ? 0 : v / yMax;
    return padding.top + (1 - t) * plotH;
  };

  const gridSteps = 5;
  const ticks = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const v = (yMax / gridSteps) * i;
    return { v, y: y(v) };
  });

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Weekly activity chart"
    >
      {/* grid */}
      {ticks.map((t) => (
        <g key={t.v}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={t.y}
            y2={t.y}
            stroke="#1a2b20"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <text
            x={padding.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#1a2b20"
            opacity="0.75"
          >
            {Math.round(t.v)}
          </text>
        </g>
      ))}

      {/* bars */}
      {(days || []).map((d, i) => {
        const baseX = padding.left + i * groupW;
        const cx = baseX + groupW / 2;

        const inc = safeNumber(d.income);
        const exp = safeNumber(d.expense);

        const incY = y(inc);
        const expY = y(exp);
        const baseY = padding.top + plotH;

        return (
          <g key={`${d.label}-${i}`}>
            <rect
              x={cx - barGap / 2 - barW}
              y={incY}
              width={barW}
              height={Math.max(0, baseY - incY)}
              fill="#2f5c2b"
              rx="2"
            />
            <rect
              x={cx + barGap / 2}
              y={expY}
              width={barW}
              height={Math.max(0, baseY - expY)}
              fill="#b91c1c"
              rx="2"
            />

            <text
              x={cx}
              y={height - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#1a2b20"
              opacity="0.8"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* axes */}
      <line
        x1={padding.left}
        x2={padding.left}
        y1={padding.top}
        y2={padding.top + plotH}
        stroke="#1a2b20"
        strokeOpacity="0.55"
      />
      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={padding.top + plotH}
        y2={padding.top + plotH}
        stroke="#1a2b20"
        strokeOpacity="0.55"
      />

      {/* legend */}
      <g
        transform={`translate(${width - padding.right - 160}, ${padding.top - 14})`}
      >
        <circle cx="6" cy="6" r="5" fill="#2f5c2b" />
        <text x="16" y="10" fontSize="11" fill="#1a2b20" opacity="0.85">
          Income
        </text>
        <circle cx="84" cy="6" r="5" fill="#b91c1c" />
        <text x="94" y="10" fontSize="11" fill="#1a2b20" opacity="0.85">
          Expense
        </text>
      </g>
    </svg>
  );
}

export default function WeeklyActivitySection({ loading, days }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a2b20]">Weekly Activity</h2>
      <div
        className="mt-3 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <div className="bg-white rounded-2xl p-4">
          {loading ? (
            <div className="h-[210px] flex items-center justify-center text-sm text-gray-500">
              Loading...
            </div>
          ) : days && days.length > 0 ? (
            <WeeklyBarChart days={days} />
          ) : (
            <div className="h-[210px] flex items-center justify-center text-sm text-gray-500">
              No weekly activity yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
