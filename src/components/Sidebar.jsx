import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Gavel,
  FolderOpen,
  Bell,
  User,
  HelpCircle,
  LogOut,
  PlusCircle,
  ClipboardCheck,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

// Nav items per role. Paths match src/routes/routeConfig.js.
const NAV_ITEMS = {
  bidder: [
    { to: "/bidder/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/bidder/tenders", label: "Tenders", icon: FileText },
    { to: "/bidder/bids", label: "My Bids", icon: Gavel },
    { to: "/bidder/documents", label: "My Documents", icon: FolderOpen },
    { to: "/bidder/notifications", label: "Notifications", icon: Bell },
    { to: "/bidder/profile", label: "Profile", icon: User },
  ],
  buyer: [
    { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/buyer/tenders/create", label: "Create Tender", icon: PlusCircle },
    { to: "/buyer/tenders", label: "My Tenders", icon: FileText },
    { to: "/buyer/notifications", label: "Notifications", icon: Bell },
    { to: "/buyer/profile", label: "Profile", icon: User },
  ],
  officer: [
    { to: "/officer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/officer/tenders", label: "Tenders", icon: FileText },
    { to: "/officer/bids", label: "Bids", icon: Gavel },
    { to: "/officer/reports", label: "Compliance Reports", icon: ClipboardCheck },
    { to: "/officer/evaluation", label: "Evaluation", icon: BarChart3 },
    { to: "/officer/notifications", label: "Notifications", icon: Bell },
    { to: "/officer/profile", label: "Profile", icon: User },
  ],
};

export default function Sidebar({ role }) {
  const items = NAV_ITEMS[role] ?? [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-navy-900 text-white flex flex-col">
      <div className="px-5 py-5 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-white shrink-0" />
          <span className="text-sm font-semibold leading-tight">
            GeM Compliance Platform
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-badge text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-navy-700/60 text-white before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-full before:bg-white"
                  : "text-navy-100 hover:bg-navy-800/60"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-navy-700 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-badge text-sm font-medium text-navy-100 hover:bg-navy-800">
          <HelpCircle className="w-4 h-4 shrink-0" />
          Help
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-badge text-sm font-medium text-navy-100 hover:bg-navy-800">
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}