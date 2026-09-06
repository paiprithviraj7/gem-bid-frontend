import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { getCurrentUser } from "../../utils/auth";
import { getOfficerProfile, getBids, getBidderProfile } from "../../services/api";
import RiskDistributionChart from "../../components/RiskDistributionChart";
import RiskShareDonut from "../../components/RiskShareDonut";
import RiskInsightsPanel from "../../components/RiskInsightsPanel";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

// A simple pass/warn/fail glyph for the comparison grid, derived from
// each bid's own verification data rather than hardcoded per bidder.
function complianceGlyph(bid) {
  if (bid.complianceScore >= 85) return <Check className="w-4 h-4 text-status-green mx-auto" />;
  if (bid.complianceScore >= 65) return <AlertTriangle className="w-4 h-4 text-status-amber mx-auto" />;
  return <X className="w-4 h-4 text-status-red mx-auto" />;
}

export default function BidComparisonPage() {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    Promise.all([getOfficerProfile(user.profileId), getBids()])
      .then(async ([officerProfile, allBids]) => {
        setOfficer(officerProfile);
        const enriched = await Promise.all(
          allBids.map(async (bid) => {
            const bidder = await getBidderProfile(bid.bidderId).catch(() => null);
            return { ...bid, bidderName: bidder?.companyName ?? bid.bidderId };
          })
        );
        setBids(enriched);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const rows = [
    { label: "Eligibility" },
    { label: "Documents" },
    { label: "Financial" },
    { label: "Technical" },
    { label: "Certifications" },
  ];

  return (
    <DashboardLayout role="officer" userName={officer?.fullName ?? "Officer"}>
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Bidder Comparison
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Compare all bids submitted for this tender side by side.
      </p>

      {!loading && bids.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <RiskDistributionChart bids={bids} />
          <RiskShareDonut bids={bids} />
          <RiskInsightsPanel bids={bids} />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-600">Loading bids...</p>
      ) : bids.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            No bids available to compare yet.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-navy-900 px-4 py-3 border-b border-border">
                    Criteria
                  </th>
                  {bids.map((bid) => (
                    <th
                      key={bid.id}
                      className="text-center font-semibold text-navy-900 px-4 py-3 border-b border-border cursor-pointer hover:text-navy-700"
                      onClick={() => navigate(`/officer/bids/${bid.id}`)}
                    >
                      {bid.bidderName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border">
                    <td className="px-4 py-3 text-ink-900 font-medium">
                      {row.label}
                    </td>
                    {bids.map((bid) => (
                      <td key={bid.id} className="px-4 py-3 text-center">
                        {complianceGlyph(bid)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-ink-900 font-medium">Risk</td>
                  {bids.map((bid) => (
                    <td key={bid.id} className="px-4 py-3 text-center">
                      <StatusBadge status={riskColor(bid.riskLevel)}>
                        {bid.riskLevel}
                      </StatusBadge>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-900 font-medium">
                    Compliance
                  </td>
                  {bids.map((bid) => (
                    <td
                      key={bid.id}
                      className="px-4 py-3 text-center font-semibold text-ink-900"
                    >
                      {bid.complianceScore}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}