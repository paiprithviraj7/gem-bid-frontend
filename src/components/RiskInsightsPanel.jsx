import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

// Plain-language summary derived from the same bids data — no separate
// numbers are invented here, everything is computed from `bids`.
export default function RiskInsightsPanel({ bids }) {
  const total = bids.length || 1;
  const low = bids.filter((b) => b.riskLevel === "LOW").length;
  const medium = bids.filter((b) => b.riskLevel === "MEDIUM").length;
  const high = bids.filter((b) => b.riskLevel === "HIGH").length;
  const lowPercent = Math.round((low / total) * 100);

  return (
    <div className="bg-surface-card border border-border rounded-card shadow-card p-6">
      <h3 className="text-sm font-semibold text-ink-900 mb-4">
        Key Insights
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-status-green-bg flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-status-green" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">
              {lowPercent}% of bidders are low risk
            </p>
            <p className="text-xs text-ink-600">
              {low} out of {bids.length} bidders
            </p>
          </div>
        </div>

        {medium > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-status-amber-bg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-status-amber" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">
                {medium} bidder{medium > 1 ? "s are" : " is"} medium risk
              </p>
              <p className="text-xs text-ink-600">Requires closer review</p>
            </div>
          </div>
        )}

        {high > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-status-red-bg flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-status-red" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">
                {high} bidder{high > 1 ? "s are" : " is"} high risk
              </p>
              <p className="text-xs text-ink-600">Needs detailed evaluation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}