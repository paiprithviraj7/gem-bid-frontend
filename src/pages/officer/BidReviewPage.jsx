import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getTenderById,
  getOfficerProfile,
  updateBidStatus,
} from "../../services/api";

function riskColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

function statusColor(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "red";
  if (status === "Clarification Requested") return "amber";
  return "neutral";
}

export default function BidReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // bid id
  const [officer, setOfficer] = useState(null);
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId).then(setOfficer);

    getBidById(id)
      .then(async (bidData) => {
        setBid(bidData);
        const [bidderProfile, tenderData] = await Promise.all([
          getBidderProfile(bidData.bidderId),
          getTenderById(bidData.tenderId),
        ]);
        setBidder(bidderProfile);
        setTender(tenderData);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDecision(status) {
    if (status === "Clarification Requested") {
      navigate(`/officer/bids/${id}/clarify`);
      return;
    }
    setUpdating(true);
    try {
      const updated = await updateBidStatus(id, status);
      setBid(updated);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !bid) {
    return (
      <DashboardLayout role="officer" userName={officer?.fullName ?? "Officer"}>
        <p className="text-sm text-ink-600">Loading bid...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-navy-900" />
        <h1 className="text-xl font-semibold text-ink-900">
          {bidder?.companyName}
        </h1>
      </div>
      <p className="text-sm text-ink-600 mb-6">
        {tender?.tenderId} &nbsp;•&nbsp; {tender?.title}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Bidder Profile">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Company</span>
                <span className="text-ink-900 font-medium">
                  {bidder?.companyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Registration Number</span>
                <span className="text-ink-900 font-medium">
                  {bidder?.companyRegNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">GSTIN</span>
                <span className="text-ink-900 font-medium">
                  {bidder?.gstin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Experience</span>
                <span className="text-ink-900 font-medium">
                  {bidder?.yearsExperience} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Annual Turnover</span>
                <span className="text-ink-900 font-medium">
                  ₹{bidder?.annualTurnover}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Technical Capacity</span>
                <span className="text-ink-900 font-medium">
                  {bidder?.technicalCapacity}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Compliance Summary">
            <div className="space-y-2">
              {["Eligibility", "Documents", "Financial", "Technical", "Certifications"].map(
                (label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0"
                  >
                    <span className="text-sm text-ink-900">{label}</span>
                    <StatusBadge status="green">Pass</StatusBadge>
                  </div>
                )
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/bidder/bids/${bid.id}/report`)}
              >
                View Full Compliance Report
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <p className="text-xs text-ink-600">Compliance</p>
            <p className="mt-1 text-3xl font-semibold text-status-green">
              {bid.complianceScore}%
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-ink-600">Risk Level</p>
              <div className="mt-1.5">
                <StatusBadge status={riskColor(bid.riskLevel)}>
                  {bid.riskLevel}
                </StatusBadge>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-ink-600">Risk Score</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">
                {bid.riskScore}/100
              </p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-ink-600">Current Status</p>
              <div className="mt-1.5">
                <StatusBadge status={statusColor(bid.status)}>
                  {bid.status}
                </StatusBadge>
              </div>
            </div>
          </Card>

          <Card title="Officer Evaluation">
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full"
                disabled={updating}
                onClick={() => handleDecision("Approved")}
              >
                Approve Bid
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                disabled={updating}
                onClick={() => handleDecision("Clarification Requested")}
              >
                Request Clarification
              </Button>
              <Button
                variant="secondary"
                className="w-full text-status-red border-status-red hover:bg-status-red-bg"
                disabled={updating}
                onClick={() => handleDecision("Rejected")}
              >
                Reject Bid
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}