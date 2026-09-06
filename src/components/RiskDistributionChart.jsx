// Simple compact bar chart showing how many bids fall into each risk
// tier. Counts are always derived from the `bids` array passed in — never
// hardcoded — so this stays correct automatically as bids change.
const RISK_TIERS = [
  { key: "LOW", label: "Low", barColor: "bg-status-green", textColor: "text-status-green" },
  { key: "MEDIUM", label: "Medium", barColor: "bg-status-amber", textColor: "text-status-amber" },
  { key: "HIGH", label: "High", barColor: "bg-status-red", textColor: "text-status-red" },
];

export default function RiskDistributionChart({ bids }) {
  const counts = RISK_TIERS.map((tier) => ({
    ...tier,
    count: bids.filter((b) => b.riskLevel === tier.key).length,
  }));

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="bg-surface-card border border-border rounded-card shadow-card p-6">
      <h3 className="text-sm font-semibold text-ink-900 mb-1">
        Risk Distribution
      </h3>
      <p className="text-xs text-ink-600 mb-6">
        Number of bidders per risk level for this tender.
      </p>

      <div className="flex items-end justify-center gap-10 h-40">
        {counts.map((tier) => (
          <div key={tier.key} className="flex flex-col items-center gap-2">
            <span className={`text-sm font-semibold ${tier.textColor}`}>
              {tier.count}
            </span>
            <div
              className={`w-12 rounded-t-md ${tier.barColor} transition-all duration-300`}
              style={{
                height: `${(tier.count / maxCount) * 100}px`,
                minHeight: tier.count > 0 ? "6px" : "2px",
                opacity: tier.count > 0 ? 1 : 0.25,
              }}
            />
            <span className="text-xs text-ink-600">{tier.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}