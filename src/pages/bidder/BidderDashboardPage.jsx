import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Gavel, Clock, ShieldCheck } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import { getBidderProfile } from "../../services/api";

// Summary card values are static/mock for the prototype — see section 18.
// They will later be computed from real tender/bid data as those
// features are built.
const SUMMARY_CARDS = [
  { label: "Active Tenders", value: "08", icon: FileText },
  { label: "Bids Submitted", value: "03", icon: Gavel },
  { label: "Under Review", value: "02", icon: Clock },
  { label: "Compliance", value: "92%", icon: ShieldCheck },
];

export default function BidderDashboardPage() {
  const navigate = useNavigate();
  const [bidder, setBidder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    getBidderProfile(user.profileId)
      .then(setBidder)
      .catch(() => setBidder(null))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout role="bidder" userName="Loading...">
        <p className="text-sm text-ink-600">Loading your dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={3}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">Dashboard</h1>
      <p className="text-sm text-ink-600 mb-6">
        Welcome back, {bidder?.companyName ?? "Bidder"}.
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