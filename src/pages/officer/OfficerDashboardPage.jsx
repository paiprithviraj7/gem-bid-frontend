import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Gavel, ClipboardList, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import { getOfficerProfile } from "../../services/api";

// Static/mock summary values for the prototype — see section 45.
const SUMMARY_CARDS = [
  { label: "Active Tenders", value: "04", icon: FileText },
  { label: "Bids Received", value: "17", icon: Gavel },
  { label: "Under Evaluation", value: "06", icon: ClipboardList },
  { label: "Low Risk Bids", value: "10", icon: ShieldCheck },
  { label: "Medium Risk Bids", value: "05", icon: ShieldAlert },
  { label: "High Risk Bids", value: "02", icon: ShieldX },
];

export default function OfficerDashboardPage() {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "officer") {
      navigate("/login");
      return;
    }

    getOfficerProfile(user.profileId)
      .then(setOfficer)
      .catch(() => setOfficer(null))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout role="officer" userName="Loading...">
        <p className="text-sm text-ink-600">Loading your dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="officer"
      userName={officer?.fullName ?? "Officer"}
      notificationCount={1}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">Dashboard</h1>
      <p className="text-sm text-ink-600 mb-6">
        Welcome back, {officer?.fullName ?? "Officer"}.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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