import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import { getTenders, getBidderProfile } from "../../services/api";

export default function AvailableTendersPage() {
  const navigate = useNavigate();
  const [bidder, setBidder] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([getBidderProfile(user.profileId), getTenders()])
      .then(([bidderProfile, allTenders]) => {
        setBidder(bidderProfile);
        // Bidders only ever see Published tenders — Drafts stay
        // invisible until the buyer publishes them.
        setTenders(allTenders.filter((t) => t.status === "Published"));
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Available Tenders
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Published tenders you may be eligible to bid on.
      </p>

      {loading ? (
        <p className="text-sm text-ink-600">Loading tenders...</p>
      ) : tenders.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            No tenders are available right now. Check back later.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => {
            const requiredDocCount = [
              tender.requireCompanyRegistration,
              tender.requireGST,
              tender.requirePAN,
              tender.requireExperience,
              tender.requireFinancial,
              tender.requireTechnical,
              tender.requireISO,
              tender.requireBIS,
            ].filter(Boolean).length;

            return (
              <Card key={tender.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-navy-800" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-600">{tender.tenderId}</p>
                      <h3 className="text-sm font-semibold text-ink-900">
                        {tender.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-600">
                        Deadline: {tender.deadline} &nbsp;•&nbsp; Requirements:{" "}
                        {requiredDocCount} &nbsp;•&nbsp; Est. Value: ₹
                        {tender.estimatedValue}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-sm text-status-green font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        You appear eligible
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/bidder/tenders/${tender.id}`)}
                  >
                    View Tender
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}