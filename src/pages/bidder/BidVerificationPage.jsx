import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "../../utils/auth";
import { submitBid, createNotification } from "../../services/api";

const VERIFICATION_STEPS = [
  "Reading submitted documents",
  "Matching bidder information",
  "Checking required documents",
  "Checking document validity",
  "Checking expiry dates",
  "Cross-verifying registration details",
  "Checking tender eligibility",
  "Checking technical requirements",
  "Assessing compliance risk",
];

// Total animation duration target: ~7.5 seconds across all steps.
const STEP_INTERVAL_MS = 800;

export default function BidVerificationPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // tender id
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bidId, setBidId] = useState(null);
  const [error, setError] = useState("");

    useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    let animationDone = false;
    let submittedBidId = null;

    function tryRedirect() {
      if (animationDone && submittedBidId) {
        navigate(`/bidder/bids/${submittedBidId}/report`, { replace: true });
      }
    }

        submitBid(user.profileId, id)
          .then(async (bid) => {
            submittedBidId = bid.id;
            setBidId(bid.id);

        // Notify the officer that a new bid needs review — section 46/57.
        await createNotification({
          recipientRole: "officer",
          recipientId: "OFF-001",
          type: "new_bid",
          title: "New Bid Received",
          message: `Compliance: ${bid.complianceScore}% • Risk: ${bid.riskLevel}`,
          link: `/officer/bids/${bid.id}`,
        });

        tryRedirect();
      })
      .catch((err) => setError(err.message));

    VERIFICATION_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(i + 1);
        setProgress(Math.round(((i + 1) / VERIFICATION_STEPS.length) * 100));
      }, i * STEP_INTERVAL_MS);
    });

    const totalDuration = VERIFICATION_STEPS.length * STEP_INTERVAL_MS + 600;
    const animationTimer = setTimeout(() => {
      animationDone = true;
      tryRedirect();
    }, totalDuration);

    return () => clearTimeout(animationTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-surface-card border border-border rounded-card p-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-navy-900" />
          <h1 className="text-base font-semibold text-ink-900">
            AI-Powered Compliance Verification
          </h1>
        </div>
        <p className="text-sm text-ink-600 mb-6">
          Analyzing bid documents...
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-navy-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-navy-900 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2.5">
          {VERIFICATION_STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${
                i < visibleSteps ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check className="w-4 h-4 text-status-green shrink-0" />
              <span className="text-ink-900">{step}</span>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-status-red bg-status-red-bg px-3 py-2 rounded-badge">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}