// Donut chart showing risk share as percentages. Built with plain SVG
// (no charting library) — segments and percentages are calculated
// directly from the same `bids` array the bar chart and table use.
const RISK_TIERS = [
  { key: "LOW", label: "Low Risk", color: "#1f7a4d" },
  { key: "MEDIUM", label: "Medium Risk", color: "#9a6b00" },
  { key: "HIGH", label: "High Risk", color: "#b3261e" },
];

const RADIUS = 60;
const STROKE = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskShareDonut({ bids }) {
  const total = bids.length || 1;
  const counts = RISK_TIERS.map((tier) => ({
    ...tier,
    count: bids.filter((b) => b.riskLevel === tier.key).length,
  }));

  let cumulativeOffset = 0;

  return (
    <div className="bg-surface-card border border-border rounded-card shadow-card p-6">
      <h3 className="text-sm font-semibold text-ink-900 mb-1">Risk Share</h3>
      <p className="text-xs text-ink-600 mb-6">
        Proportion of bidders by risk level.
      </p>

      <div className="flex items-center gap-6">
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={STROKE}
            />
            {counts.map((tier) => {
              const fraction = tier.count / total;
              const dash = fraction * CIRCUMFERENCE;
              const segment = (
                <circle
                  key={tier.key}
                  cx="80"
                  cy="80"
                  r={RADIUS}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={-cumulativeOffset}
                  strokeLinecap={fraction > 0 && fraction < 1 ? "butt" : "round"}
                />
              );
              cumulativeOffset += dash;
              return segment;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-ink-900">
              {bids.length}
            </span>
            <span className="text-xs text-ink-600">Bidders</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {counts.map((tier) => (
            <div key={tier.key} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-ink-900">
                {tier.label} ({tier.count})
              </span>
              <span className="text-ink-600">
                — {Math.round((tier.count / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}