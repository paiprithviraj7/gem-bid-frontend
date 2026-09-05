import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { FileUploadField } from "../../components/FormFields";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidById,
  getBidderProfile,
  getClarifications,
  resolveClarification,
} from "../../services/api";

export default function ClarificationResponsePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // bid id
  const [bidder, setBidder] = useState(null);
  const [bid, setBid] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getBidById(id),
      getClarifications({ bidId: id }),
    ])
      .then(([bidderProfile, bidData, clarifications]) => {
        setBidder(bidderProfile);
        setBid(bidData);
        // Most recent pending clarification for this bid.
        const pending = clarifications
          .filter((c) => c.status === "Pending")
          .slice(-1)[0];
        setClarification(pending ?? null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleResolve() {
    setResolving(true);
    try {
      await resolveClarification(clarification.id);
      setResolved(true);
    } finally {
      setResolving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="bidder" userName={bidder?.companyName ?? "Bidder"}>
        <p className="text-sm text-ink-600">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Clarification Required
      </h1>
      <p className="text-sm text-ink-600 mb-6">Tender: {bid?.tenderId}</p>

      {!clarification ? (
        <Card>
          <p className="text-sm text-ink-600">
            No pending clarification found for this bid.
          </p>
        </Card>
      ) : resolved ? (
        <Card>
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-status-green mx-auto mb-3" />
            <p className="text-sm font-medium text-ink-900">
              Updated document submitted.
            </p>
            <p className="text-sm text-ink-600 mt-1">
              The Procurement Officer will re-review your bid.
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate("/bidder/bids")}
            >
              Back to My Bids
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start gap-2 mb-5 pb-5 border-b border-border">
            <AlertTriangle className="w-5 h-5 text-status-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink-900">
                Document: {clarification.document}
              </p>
              <p className="text-sm text-ink-600 mt-1">
                Reason: {clarification.reason}
              </p>
              <p className="text-sm text-ink-900 mt-2">
                {clarification.message}
              </p>
            </div>
          </div>

          <FileUploadField
            label={`Updated ${clarification.document}`}
            fileName={uploadedFile}
            onChange={setUploadedFile}
          />

          <Button
            variant="primary"
            className="w-full mt-4"
            disabled={!uploadedFile || resolving}
            onClick={handleResolve}
          >
            {resolving ? "Submitting..." : "Submit Updated Document"}
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}