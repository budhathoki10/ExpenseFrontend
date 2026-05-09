export function formatMoney(amount) {
  const n = Number(amount);
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function safeNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export function labelPoint(cx, cy, r, angleDeg) {
  return polarToCartesian(cx, cy, r, angleDeg);
}

export function buildMonthlySummaryText({
  expense,
  topCategoryName,
  topCategoryPct,
}) {
  const exp = safeNumber(expense);
  const lead = exp > 0
    ? `This month, you spent Rs. ${formatMoney(exp)} in tracked expenses.`
    : "No expense data is available for this month yet.";

  const focus = topCategoryName
    ? ` The largest share went to ${topCategoryName}${topCategoryPct ? ` (~${topCategoryPct}%)` : ""}.`
    : "";

  const close = exp > 0
    ? " Keep an eye on your biggest categories to optimize spending for next month."
    : " Log new expenses to generate richer reports.";

  return `${lead}${focus}${close}`.trim();
}

export function buildSuggestionAndOpportunity({ income, expense }) {
  const inc = safeNumber(income);
  const exp = safeNumber(expense);

  const expenseHeavy = inc > 0 ? exp / inc >= 0.7 : exp > 0;

  if (expenseHeavy) {
    return {
      suggestion: "Reduce weekend spending to bring expenses down.",
      opportunity:
        "Increase savings by limiting high-frequency small expenses.",
    };
  }

  return {
    suggestion: "You’ve saved well — give yourself a treat (within budget).",
    opportunity:
      "Consider increasing savings or putting extra money toward your goals.",
  };
}
