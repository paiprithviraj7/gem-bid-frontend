import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Archive, Gavel, ClipboardList } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import { getBuyerProfile } from "../../services/api";

// Static/mock summary values for the prototype — see section 20.
const SUMMARY_CARDS = [
  { label: "Active Tenders", value: "04", icon: FileText },
  { label: "Closed Tenders", value: "12", icon: Archive },
  { label: "Bids Received", value: "28", icon: Gavel },
  { label: "Under Evaluation", value: "06", icon: ClipboardList },
];

export default function BuyerDashboardPage() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    getBuyerProfile(user.profileId)
      .then(setBuyer)
      .catch(() => setBuyer(null))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout role="buyer" userName="Loading...">
        <p className="text-sm text-ink-600">Loading your dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
      notificationCount={2}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">Dashboard</h1>
      <p className="text-sm text-ink-600 mb-6">
        Welcome back, {buyer?.organizationName ?? "Buyer"}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-600">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-ink-900">
                  {value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-navy-800" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}