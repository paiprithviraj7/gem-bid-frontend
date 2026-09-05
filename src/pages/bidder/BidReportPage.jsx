import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { getCurrentUser } from "../../utils/auth";
import { getBidById, getBidderProfile, getTenderById } from "../../services/api";

const DOC_LABELS = {
  companyRegistration: "Company Registration",
  gst: "GST Certificate",
  pan: "PAN",
  experience: "Experience Certificate",
  financial: "Financial Statement",
  technical: "Technical Capability",
  iso: "ISO Certificate",
  representative: "Authorized Representative",
};

const GOV_LABELS = {
  gstn: "GSTN",
  pan: "PAN Database",
  mca: "MCA Registration",
  udyam: "Udyam Registration",
  nsic: "NSIC",
  epfo: "EPFO",
  esic: "ESIC",
};

function riskBadgeColor(level) {
  if (level === "LOW") return "green";
  if (level === "MEDIUM") return "amber";
  return "red";
}

export default function BidReportPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // bid id
  const [bid, setBid] = useState(null);
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout role="bidder" userName={bidder?.companyName ?? "Bidder"}>
        <p className="text-sm text-ink-600">Loading report...</p>
      </DashboardLayout>
    );
  }

  if (error || !bid) {
    return (
      <DashboardLayout role="bidder" userName="Bidder">
        <Card>
          <p className="text-sm text-status-red">{error || "Bid not found."}</p>
        </Card>
      </DashboardLayout>
    );
  }

  const { verification } = bid;

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-navy-900" />
        <h1 className="text-xl font-semibold text-ink-900">
          Bid Compliance Report
        </h1>
      </div>
      <p className="text-sm text-ink-600 mb-6">
        {tender?.tenderId} &nbsp;•&nbsp; {tender?.title}
      </p>

      {/* Overall result */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-ink-600">Overall Compliance</p>
          <p className="mt-1 text-3xl font-semibold text-status-green">
            {bid.complianceScore}%
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-600">Risk Level</p>
          <div className="mt-2">
            <StatusBadge status={riskBadgeColor(bid.riskLevel)}>
              {bid.riskLevel}
            </StatusBadge>
          </div>
        </Card>
        <Card>
          <p className="text-xs text-ink-600">Risk Score</p>
          <p className="mt-1 text-3xl font-semibold text-ink-900">
            {bid.riskScore}
            <span className="text-base text-ink-600">/100</span>
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Document Verification */}
        <Card title="Document Verification">
          <div className="space-y-2">
            {Object.entries(verification.documents).map(([key, status]) => (
              <div
                key={key}
                className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0"
              >
                <span className="text-sm text-ink-900">
                  {DOC_LABELS[key] ?? key}
                </span>
                <StatusBadge status="green">{status}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>

        {/* Government Cross-Verification */}
        <Card title="Government Record Cross-Verification">
          <div className="space-y-2">
            {Object.entries(verification.governmentCrossCheck).map(
              ([key, status]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0"
                >
                  <span className="text-sm text-ink-900">
                    {GOV_LABELS[key] ?? key}
                  </span>
                  <StatusBadge status="green">{status}</StatusBadge>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Technical & Financial Compliance */}
        <Card title="Technical & Financial Compliance">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-600">
                Required Technical Capacity
              </span>
              <span className="text-ink-900 font-medium">
                {tender?.minTechnicalCapacity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-600">Bidder Technical Capacity</span>
              <span className="text-ink-900 font-medium">
                {bidder?.technicalCapacity}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-ink-600">Required Turnover</span>
              <span className="text-ink-900 font-medium">
                ₹{tender?.minTurnover}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-600">Bidder Turnover</span>
              <span className="text-ink-900 font-medium">
                ₹{bidder?.annualTurnover}
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <StatusBadge status="green">Requirements Satisfied</StatusBadge>
            </div>
          </div>
        </Card>

        {/* Exceptions */}
        <Card title="Exceptions">
          {verification.nameConsistencyWarning ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-status-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-ink-900 font-medium">
                  Minor Name Variation Detected
                </p>
                <p className="text-sm text-ink-600 mt-1">
                  GST legal name and company registration name show a small
                  formatting difference (e.g. "Pvt Ltd" vs "Private
                  Limited"). No critical compliance issue identified.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-600">
              No exceptions found in this bid.
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}