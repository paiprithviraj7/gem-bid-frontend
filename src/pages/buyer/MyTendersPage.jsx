import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import { getTenders, getBuyerProfile } from "../../services/api";

function statusColor(status) {
  if (status === "Published") return "green";
  if (status === "Draft") return "amber";
  return "neutral";
}

export default function MyTendersPage() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    Promise.all([getBuyerProfile(user.profileId), getTenders()])
      .then(([buyerProfile, allTenders]) => {
        setBuyer(buyerProfile);
        // In a multi-buyer system we'd filter by buyer id — for the
        // prototype's single demo buyer, showing all tenders is fine.
        setTenders(allTenders);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
      notificationCount={2}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">My Tenders</h1>
          <p className="text-sm text-ink-600">
            Tenders you've created and published.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/buyer/tenders/create")}
        >
          <PlusCircle className="w-4 h-4" />
          Create Tender
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-600">Loading tenders...</p>
      ) : tenders.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            You haven't created any tenders yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tenders.map((tender) => (
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
                      Deadline: {tender.deadline}
                    </p>
                  </div>
                </div>
                <StatusBadge status={statusColor(tender.status)}>
                  {tender.status}
                </StatusBadge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}