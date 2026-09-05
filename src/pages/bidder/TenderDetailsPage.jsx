import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import {
  getTenderById,
  getBidderProfile,
  getExtraDocuments,
} from "../../services/api";
import { buildComplianceChecklist } from "../../utils/complianceChecklist";

function formatCurrency(value) {
  if (!value) return "—";
  const num = Number(value);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function TenderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bidder, setBidder] = useState(null);
  const [tender, setTender] = useState(null);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getTenderById(id),
      getExtraDocuments(user.profileId, id),
    ])
      .then(([bidderProfile, tenderData, extraDocs]) => {
        setBidder(bidderProfile);
        setTender(tenderData);
        setExtras(extraDocs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate, id]);

  if (loading) {
    return (
      <DashboardLayout role="bidder" userName={bidder?.companyName ?? "Bidder"}>
        <p className="text-sm text-ink-600">Loading tender...</p>
      </DashboardLayout>
    );
  }

  if (error || !tender) {
    return (
      <DashboardLayout role="bidder" userName={bidder?.companyName ?? "Bidder"}>
        <Card>
          <p className="text-sm text-status-red">
            {error || "Tender not found."}
          </p>
        </Card>
      </DashboardLayout>
    );
  }

    const checklist = buildComplianceChecklist(tender, bidder, extras);

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <p className="text-xs text-ink-600">{tender.tenderId}</p>
      <h1 className="text-xl font-semibold text-ink-900 mb-6">
        {tender.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: tender info */}
        <div className="lg:col-span-2 space-y-5">
          <Card title="Tender Details">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Organization</span>
                <span className="text-ink-900 font-medium">
                  Ministry of Petroleum & Natural Gas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Description</span>
                <span className="text-ink-900 font-medium text-right max-w-xs">
                  {tender.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Deadline</span>
                <span className="text-ink-900 font-medium">
                  {tender.deadline}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Estimated Value</span>
                <span className="text-ink-900 font-medium">
                  {formatCurrency(tender.estimatedValue)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Tender Compliance Checklist">
            <div className="space-y-2">
              {checklist.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-sm text-ink-900">{item.label}</span>
                  {item.available ? (
                    <StatusBadge status="green">Available</StatusBadge>
                  ) : (
                    <StatusBadge status="amber">Missing</StatusBadge>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-semibold text-ink-900">
                  {checklist.total}
                </p>
                <p className="text-xs text-ink-600">Requirements</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-status-green">
                  {checklist.available}
                </p>
                <p className="text-xs text-ink-600">Already Available</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-status-amber">
                  {checklist.missing}
                </p>
                <p className="text-xs text-ink-600">Additional Required</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: action panel */}
        <div>
          <Card>
            {checklist.missing === 0 ? (
              <>
                <div className="flex items-center gap-2 text-status-green font-medium text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  All required documents are available
                </div>
                <p className="text-sm text-ink-600 mb-4">
                  Your bid is ready for submission.
                </p>
                <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate(`/bidder/tenders/${tender.id}/verify`)}
                >
                    Submit Bid
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-status-amber font-medium text-sm mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  {checklist.missing} document
                  {checklist.missing > 1 ? "s" : ""} required
                </div>
                <p className="text-sm text-ink-600 mb-4">
                  You do not need to upload documents already available in
                  your profile. Upload only the missing ones below.
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() =>
                    navigate(`/bidder/tenders/${tender.id}/upload`)
                  }
                >
                  Upload Missing Documents
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}