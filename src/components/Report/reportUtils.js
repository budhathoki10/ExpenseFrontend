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
  income,
  expense,
  balance,
  topCategoryName,
  topCategoryPct,
}) {
  const inc = safeNumber(income);
  const exp = safeNumber(expense);
  const bal = safeNumber(balance);
  const ratio = inc > 0 ? exp / inc : exp > 0 ? 1 : 0;

  const balanced = inc > 0 && Math.abs(inc - exp) / inc <= 0.12;
  const expenseHeavy = !balanced && (inc === 0 ? exp > 0 : exp > inc);

  const lead = balanced
    ? "This month, your financial activity reflects a balanced pattern."
    : expenseHeavy
      ? "This month, your spending was higher than your income, so cash flow looks expense-heavy."
      : "This month, your income stayed ahead of expenses, so you built some savings momentum.";

  const focus = topCategoryName
    ? ` A significant portion of expenses went to ${topCategoryName}${topCategoryPct ? ` (~${topCategoryPct}%)` : ""}.`
    : "";

  const close = expenseHeavy
    ? " Try tightening discretionary purchases and keep logging every transaction for better control."
    : ratio < 0.5
      ? " You're spending under control — consider allocating a bit more toward goals or savings."
      : " You're doing fine — a small budget check-in can keep you on track.";

  const extra =
    bal > 0 ? ` Current net balance is Rs. ${formatMoney(bal)}.` : "";

  return `${lead}${focus}${extra}${close}`.trim();
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
