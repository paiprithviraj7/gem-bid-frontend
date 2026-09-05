import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { getCurrentUser } from "../../utils/auth";
import { getBids, getTenderById, getBidderProfile } from "../../services/api";

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  if (status === "Clarification Requested") return "amber";
  return "neutral";
}

export default function MyBidsPage() {
  const navigate = useNavigate();
  const [bidder, setBidder] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([getBidderProfile(user.profileId), getBids({ bidderId: user.profileId })])
      .then(async ([bidderProfile, bids]) => {
        setBidder(bidderProfile);
        const enriched = await Promise.all(
          bids.map(async (bid) => {
            const tender = await getTenderById(bid.tenderId).catch(() => null);
            return { ...bid, tenderTitle: tender?.title ?? bid.tenderId };
          })
        );
        setRows(enriched);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">My Bids</h1>
      <p className="text-sm text-ink-600 mb-6">
        Bids you've submitted and their current status.
      </p>

      {loading ? (
        <p className="text-sm text-ink-600">Loading bids...</p>
      ) : rows.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            You haven't submitted any bids yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((bid) => (
            <Card key={bid.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                    <Gavel className="w-5 h-5 text-navy-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">
                      {bid.tenderTitle}
                    </h3>
                    <p className="text-sm text-ink-600">
                      Compliance: {bid.complianceScore}% &nbsp;•&nbsp; Risk:{" "}
                      {bid.riskLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={statusColor(bid.status)}>
                    {bid.status}
                  </StatusBadge>
                  {bid.status === "Clarification Requested" ? (
                    <button
                      className="text-sm font-medium text-navy-900 hover:underline"
                      onClick={() => navigate(`/bidder/bids/${bid.id}/clarification`)}
                    >
                      View Request
                    </button>
                  ) : (
                    <button
                      className="text-sm font-medium text-navy-900 hover:underline"
                      onClick={() => navigate(`/bidder/bids/${bid.id}/report`)}
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}