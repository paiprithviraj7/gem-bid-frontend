import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, ShieldCheck, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import { getCurrentUser } from "../../utils/auth";
import {
  getBidderProfile,
  getNotifications,
  markNotificationRead,
} from "../../services/api";

const TYPE_ICON = {
  new_tender: FileText,
  verification_complete: ShieldCheck,
  clarification: AlertTriangle,
};

export default function BidderNotificationsPage() {
  const navigate = useNavigate();
  const [bidder, setBidder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "bidder") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBidderProfile(user.profileId),
      getNotifications(user.profileId),
    ])
      .then(([bidderProfile, notifs]) => {
        setBidder(bidderProfile);
        setNotifications(notifs);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleClick(notif) {
    if (!notif.read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    if (notif.link) navigate(notif.link);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      role="bidder"
      userName={bidder?.companyName ?? "Bidder"}
      notificationCount={unreadCount}
    >
      <h1 className="text-xl font-semibold text-ink-900 mb-1">
        Notifications
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Updates on tenders, verification, and clarification requests.
      </p>

      {loading ? (
        <p className="text-sm text-ink-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-600 text-center py-6">
            You have no notifications yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = TYPE_ICON[notif.type] ?? Bell;
            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left bg-surface-card border rounded-card p-4 flex items-start gap-3 transition-colors ${
                  notif.read
                    ? "border-border"
                    : "border-navy-900 bg-navy-100/40"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-navy-800" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    {notif.title}
                  </p>
                  <p className="text-sm text-ink-600 mt-0.5">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-status-red shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}