import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../utils/auth";
import { getNotifications } from "../services/api";

// Wraps every dashboard page. `role` controls sidebar nav items,
// `userName` feeds the top bar. The notification bell count is fetched
// here automatically from the logged-in user's real notifications —
// no need to pass notificationCount as a prop anymore.
export default function DashboardLayout({ role, userName, children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    getNotifications(user.profileId)
      .then((notifs) => {
        setUnreadCount(notifs.filter((n) => !n.read).length);
      })
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar role={role} />
      <div className="ml-60">
        <Navbar userName={userName} notificationCount={unreadCount} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}